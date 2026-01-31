type PaymentItem = {
  id: string;
  title: string; // KUIT 6th Project / 디자이너2
  amount: number; // 100000
  startDate: string; // 2025.11.23
  endDate: string; // 2025.12.25
};

const dummy: PaymentItem[] = [
  { id: "1", title: "KUIT 6th Project / 디자이너2", amount: 100000, startDate: "2025.11.23", endDate: "2025.12.25"},
];

const formatKRW = (n: number) => n.toLocaleString("ko-KR") + "원";

export default function Payments() {
  const items = dummy; // API연동 할때 교체해야함

  return (
    <main className="w-full bg-white">
      <section className="px-5 pt-4 pb-10">
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl bg-gray-100 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-gray-700">
                    {it.title}
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-black">
                    {formatKRW(it.amount)}
                  </p>
                </div>

                <p className="shrink-0 pt-6 text-[11px] text-gray-400">
                  {it.startDate} ~ {it.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
