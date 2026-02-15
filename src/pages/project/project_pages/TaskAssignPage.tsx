import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen, BottomCTA } from "../components/_ui";

type Partner = { id: number; name: string; role: "dev" | "design" };

export default function TaskAssignPage() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();

  const partners = useMemo<Partner[]>(
    () => [
      { id: 1, name: "파트너 개발자1", role: "dev" },
      { id: 2, name: "파트너 디자이너1", role: "design" },
      { id: 3, name: "파트너 디자이너2", role: "design" },
      { id: 4, name: "파트너 디자이너3", role: "design" },
    ],
    []
  );

  const devs = partners.filter((p) => p.role === "dev");
  const designers = partners.filter((p) => p.role === "design");
  const [selected, setSelected] = useState<number>(1);

  const Row = ({
    name,
    active,
    onClick,
  }: {
    name: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-none"
    >
      <div className="flex h-[86px] w-full">
        <div className={`w-20 ${active ? "bg-[#9BC0FF]" : "bg-black/10"}`} />
        <div
          className={[
            "flex-1 bg-gradient-to-b from-[#0B0B0C] to-[#242426]",
            "flex items-center px-6 text-white font-extrabold text-[16px]",
            active ? "ring-2 ring-[#0B5CFF]" : "",
          ].join(" ")}
        >
          {name}
        </div>
      </div>
    </button>
  );

  return (
    <Screen>
      <div className="mt-2 text-center text-[18px] font-extrabold text-black">
        담당 파트너 선택
      </div>

      <div className="mt-6 text-[18px] font-extrabold text-black">개발자</div>
      <div className="mt-3 space-y-2">
        {devs.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl">
            <Row
              name={p.name}
              active={selected === p.id}
              onClick={() => setSelected(p.id)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-[18px] font-extrabold text-black">디자이너</div>
      <div className="mt-3 space-y-2">
        {designers.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl">
            <Row
              name={p.name}
              active={selected === p.id}
              onClick={() => setSelected(p.id)}
            />
          </div>
        ))}
      </div>

      <BottomCTA
        label="배정하기"
        onClick={() => navigate(`/project/${projectId}/tasks/${taskId}/edit`)}
      />
    </Screen>
  );
}
