import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  steps?: {
    id: number;
    description: React.ReactNode;
  }[];
  links?: {
    title: string;
    href: string;
  }[];
}

export const WelcomeEmail = ({ steps, links }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#80410e",
              offwhite: "#FEF3C7",
            },
            spacing: {
              0: "0px",
              20: "20px",
              45: "45px",
            },
          },
        },
      }}
    >
      <Preview>Welcome to Beauty Nails</Preview>
      <Body className="bg-offwhite font-sans text-base">
        <h1 className="text-center text-2xl  text-[#80410e] mb-8">
          Beauty Nails Salon
        </h1>
        <Container className="bg-white p-45 rounded-lg shadow-md">
          <Heading className="my-0 text-center leading-8 text-[#80410e]">
            Welcome to Beauty Nails Salon
          </Heading>

          <Section>
            <Row>
              <Text className="text-base text-gray-800">
                Felicitations! vous avez rejoint la famille Beauty Nails Salon.
                Nous sommes ravis de vous compter parmi nous.
              </Text>

              <Text className="text-base text-gray-800">
                Voici quelques étapes pour vous aider à démarrer :
              </Text>
            </Row>
          </Section>

          <ul>{steps?.map(({ description }) => description)}</ul>

          <Section className="text-center">
            <Button className="rounded-lg bg-[#80410e] px-4.5 py-3 text-white hover:bg-[#8C6A1A]">
              You may have already received an email with your email
              verification code.
            </Button>
          </Section>

          <Section className="mt-45">
            <Row>
              {links?.map((link) => (
                <Column key={link.title}>
                  <Link className=" text-[#80410e] underline" href={link.href}>
                    {link.title}
                  </Link>{" "}
                  <span className="text-[#80410e]">→</span>
                </Column>
              ))}
            </Row>
          </Section>
        </Container>

        <Container className="mt-20">
          <Section>
            <Row>
              <Column className="px-20 text-right">
                <Link className="text-gray-500">Unsubscribe</Link>
              </Column>
              <Column className="text-left">
                <Link className="text-gray-500">Manage Preferences</Link>
              </Column>
            </Row>
          </Section>
          <Text className="mb-45 text-center text-gray-400">
            Beauty Nails Salon, Goma, Q. Himbi 2, DR Congo
          </Text>
          <Text className="mb-20 text-center text-gray-400">
            © {new Date().getFullYear()} Beauty Nails Salon. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const PreviewProps = {
  steps: [
    {
      id: 1,
      description: (
        <li className="mb-20" key={1}>
          <strong>Explore your dashboard.</strong> Access tools and insights to
          manage your business effectively.
        </li>
      ),
    },
    {
      id: 2,
      description: (
        <li className="mb-20" key={2}>
          <strong>Set up your team.</strong> Invite team members and assign
          roles to collaborate seamlessly.
        </li>
      ),
    },
    {
      id: 3,
      description: (
        <li className="mb-20" key={3}>
          <strong>Integrate your systems.</strong> Connect CRM, HR, and
          financial tools for unified management.
        </li>
      ),
    },
    {
      id: 4,
      description: (
        <li className="mb-20" key={4}>
          <strong>Learn more.</strong> Explore our documentation and resources
          to maximize your experience.
        </li>
      ),
    },
  ],
  links: [
    {
      title: "Visit the forums",
      href: "https://beauty-nails.vercel.app/forums",
    },
    { title: "Read the docs", href: "https://beauty-nails.vercel.app/docs" },
    {
      title: "Contact support",
      href: "https://beauty-nails.vercel.app/support",
    },
  ],
};

export default WelcomeEmail;
