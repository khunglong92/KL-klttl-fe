interface DetailProductNotFoundProps {
  t: any;
}

export default function DetailProductNotFound({
  t,
}: DetailProductNotFoundProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-lg shadow-lg">
          <p className="text-lg text-card-foreground">
            {t("productDetail.error.notFound")}
          </p>
        </div>
      </main>
    </div>
  );
}
