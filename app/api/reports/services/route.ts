import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError} from '@/lib/api/helpers';
import { format } from 'date-fns';
import { ContentSection, generateReportPdf } from '@/lib/pdf/jsPdfGenerator';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    const pdfTrigger = searchParams.get('pdfTrigger') === 'true';

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(now);
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get all completed appointments with related services in the period
    const completedAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate
        },
        status: 'completed'
      },
      include: {
        service: true,
        sale: {
          include: {
            items: {
              include: {
                service: true
              }
            }
          }
        }
      }
    });

    // Get all services that were part of completed sales
    const serviceSales = await prisma.saleItem.findMany({
      where: {
        sale: {
          createdAt: {
            gte: startDate
          },
          paymentStatus: 'completed'
        }
      },
      include: {
        service: true,
        sale: true
      }
    });

    // Calculate service performance metrics
    const serviceStats = serviceSales.reduce((acc: any, saleItem: any) => {
      const serviceId = saleItem.service.id;
      if (!acc[serviceId]) {
        acc[serviceId] = {
          id: serviceId,
          name: saleItem.service.name,
          category: saleItem.service.category,
          count: 0,
          revenue: 0,
          avgPrice: 0
        };
      }
      
      acc[serviceId].count += saleItem.quantity;
      acc[serviceId].revenue += Number(saleItem.price) * saleItem.quantity;
      
      return acc;
    }, {});

    // Calculate average price for each service
    Object.values(serviceStats).forEach((service: any) => {
      service.avgPrice = service.count > 0 ? service.revenue / service.count : 0;
    });

    // Get all services to include services with zero sales
    const allServices = await prisma.service.findMany({
      where: {
        isActive: true
      }
    });

    // Merge with all services to include zero-sales services
    allServices.forEach(service => {
      if (!serviceStats[service.id]) {
        serviceStats[service.id] = {
          id: service.id,
          name: service.name,
          category: service.category,
          count: 0,
          revenue: 0,
          avgPrice: 0
        };
      }
    });

    // Sort services by various metrics
    const servicesByRevenue = Object.values(serviceStats)
      .sort((a: any, b: any) => b.revenue - a.revenue);

    const servicesByCount = Object.values(serviceStats)
      .sort((a: any, b: any) => b.count - a.count);

    const servicesByGrowth = Object.values(serviceStats)
      .sort((a: any, b: any) => (b.revenue / Math.max(1, b.count)) - (a.revenue / Math.max(1, a.count)));

    const mostPopular: any = servicesByRevenue[0] || null;

    const responseData = {
      services: servicesByRevenue.map((service: any) => ({
        id: service.id,
        name: service.name,
        category: service.category,
        count: service.count,
        revenue: service.revenue,
        avgPrice: service.avgPrice,
        growth: service.count > 0 ? ((service.revenue / service.count) / service.avgPrice * 100).toFixed(2) + '%' : '0%'
      })),
      mostPopular: mostPopular ? {
        id: mostPopular.id,
        name: mostPopular.name,
        category: mostPopular.category,
        count: mostPopular.count,
        revenue: mostPopular.revenue,
        avgPrice: mostPopular.avgPrice
      } : null
    };

    if (pdfTrigger) {
      // Format data for PDF
      const sections: ContentSection[] = [
        {
          title: 'Service Performance Report',
          type: 'keyValue',
          data: {
            'Period:': period,
            'Total Services:': allServices.length.toString(),
            'Active Services:': servicesByRevenue.filter((s: any) => s.count > 0).length.toString(),
            'Most Popular Service:': mostPopular?.name || 'None',
            'Total Revenue:': `CDF ${(responseData.services.reduce((sum, s) => sum + s.revenue, 0)).toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }
        },
        {
          title: 'Top Performing Services',
          type: 'table',
          data: {
            headers: ['Service', 'Category', 'Sales Count', 'Revenue', 'Avg Price'],
            rows: servicesByRevenue.slice(0, 10).map((service: any) => [
              service.name,
              service.category,
              service.count.toString(),
              `CDF ${service.revenue.toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `CDF ${service.avgPrice.toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ])
          }
        }
      ];

      // Generate PDF
      const pdfBuffer = await generateReportPdf(
        sections,
        'Beauty Nails - Service Performance Report',
        `${period.charAt(0).toUpperCase() + period.slice(1)} (${format(startDate, 'MMM dd, yyyy')} - ${format(now, 'MMM dd, yyyy')})`
      );

      // Return PDF response
      return new NextResponse(pdfBuffer.toString('binary'), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="service-performance-report-${period}-${format(new Date(), 'yyyy-MM-dd')}.pdf"`,
        },
      });
    }

    return successResponse(responseData);
  } catch (error) {
    return handleApiError(error);
  }
}