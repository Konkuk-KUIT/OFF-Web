type PaymentItem = {
  id: string;
  title: string; // KUIT 6th Project / 디자이너2
  amount: number; // 100000
  date: string; // 2025.11.23
};

const dummy: PaymentItem[] = [
  { id: "1", title: "KUIT 6th Project / 디자이너2", amount: 100000, date: "2025.11.23" },
  { id: "2", title: "KUIT 6th Project / 마케터1", amount: 150000, date: "2025.11.23" },
  { id: "3", title: "KUIT 6th Project / 개발자2", amount: 200000, date: "2025.11.23" },
  { id: "4", title: "KUIT 6th Project / 개발자1", amount: 70000, date: "2025.11.23" },
  { id: "5", title: "KUIT 6th Project / 디자이너1", amount: 200000, date: "2025.11.23" },
  { id: "6", title: "KUIT 6th Project / 기획자1", amount: 100000, date: "2025.11.23" },
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
                  {it.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
