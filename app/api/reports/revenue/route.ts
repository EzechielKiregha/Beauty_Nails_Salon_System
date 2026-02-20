import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';
import { format } from 'date-fns';
import { ContentSection, generateReportPdf } from '@/lib/pdf/jsPdfGenerator';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const { searchParams } = new URL(request.url);
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const pdfTrigger = searchParams.get('pdfTrigger') === 'true';

    if (!fromParam || !toParam) {
      return errorResponse('Dates requises', 400);
    }

    console.log('Generating revenue report with params: ', { fromParam, toParam, pdfTrigger });

    const from = Date.parse(fromParam) ? new Date(fromParam): new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days if parsing fails
    const to = Date.parse(toParam) ? new Date(toParam) : new Date();

    console.log('Generating revenue report for period: ', { from, to });

    // Optimized query with proper joins
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
        paymentStatus: {
          in: ['completed', 'pending']
        },
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        client: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        payments: {
          select: {
            method: true,
            amount: true
          }
        }
      },
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

    // Group by service category using Prisma
    const breakdown: Record<string, number> = {};
    const serviceCount: Record<string, number> = {};
    
    sales.forEach((sale: any) => {
      for (const item of sale.items) {
        const category = item.service.category;
        const price = Number(item.price);
        const quantity = item.quantity;
        
        breakdown[category] = (breakdown[category] || 0) + (price * quantity);
        serviceCount[item.service.name] = (serviceCount[item.service.name] || 0) + quantity;
      }
    });

    // Get top selling services
    const topSellingServices = Object.entries(serviceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    // Get payment method breakdown
    const paymentMethods: Record<string, number> = {};
    sales.forEach((sale: any) => {
      if (sale.payments && sale.payments.length > 0) {
        sale.payments.forEach((payment: any) => {
          paymentMethods[payment.method] = (paymentMethods[payment.method] || 0) + Number(payment.amount);
        });
      }
    });

    if (pdfTrigger) {
      // Format data for PDF
      const sections: ContentSection[] = [
        {
          title: 'Revenue Report',
          type: 'keyValue',
          data: {
            'Period:': `${format(from, 'MMM dd, yyyy')} - ${format(to, 'MMM dd, yyyy')}`,
            'Total Revenue:': `CDF ${totalRevenue.toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            'Total Sales:': sales.length.toString(),
            'Average Sale Value:': `CDF ${(totalRevenue / Math.max(sales.length, 1)).toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }
        },
        {
          title: 'Revenue by Service Category',
          type: 'table',
          data: {
            headers: ['Category', 'Revenue'],
            rows: Object.entries(breakdown).map(([category, revenue]) => [
              category,
              `CDF ${revenue.toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ])
          }
        },
        {
          title: 'Top Selling Services',
          type: 'table',
          data: {
            headers: ['Service', 'Quantity Sold'],
            rows: topSellingServices.map(([service, quantity]) => [
              service,
              quantity.toString()
            ])
          }
        },
        {
          title: 'Payment Methods',
          type: 'table',
          data: {
            headers: ['Method', 'Amount'],
            rows: Object.entries(paymentMethods).map(([method, amount]) => [
              method,
              `CDF ${amount.toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ])
          }
        }
      ];

      // Generate PDF
      const pdfBuffer = await generateReportPdf(
        sections,
        'Beauty Nails - Revenue Report',
        `${format(from, 'MMM dd')} to ${format(to, 'MMM dd')}`
      );

      // Return PDF response
      return new NextResponse(pdfBuffer.toString('binary'), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="revenue-report-${format(new Date(), 'yyyy-MM-dd')}.pdf"`,
        },
      });
    }

    console.log('Revenue report generated successfully: ', {
      totalRevenue,
      salesCount: sales.length,
      breakdown,
      serviceCount,
      topSellingServices,
      paymentMethods,
      period: { from: fromParam, to: toParam },
    });

    return successResponse({
      totalRevenue,
      salesCount: sales.length,
      breakdown,
      serviceCount,
      topSellingServices,
      paymentMethods,
      period: { from: fromParam, to: toParam },
    });
  } catch (error) {
    return handleApiError(error);
  }
}