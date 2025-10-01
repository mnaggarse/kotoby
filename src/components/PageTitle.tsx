interface PageTitleProps {
  children: React.ReactNode;
}
export default function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-center text-3xl font-ibm-medium mb-8">{children}</h1>
  );
}
