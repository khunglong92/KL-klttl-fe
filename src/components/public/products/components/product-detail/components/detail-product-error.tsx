interface DetailProductErrorProps {
  t: any;
  error: any;
}

export default function DetailProductError({
  t,
  error,
}: DetailProductErrorProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-lg shadow-lg border border-destructive">
          <p className="text-lg text-destructive">
            {t("productDetail.error.loadError", { message: error.message })}
          </p>
        </div>
      </main>
    </div>
  );
}
