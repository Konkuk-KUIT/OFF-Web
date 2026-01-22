type Props = { className?: string };

export default function ProjectIcon({ className = "" }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 18.5V5.5C3 5.22386 3.22386 5 3.5 5H7.44451C7.59968 5 7.74606 5.07204 7.84071 5.195L9.84989 7.805C9.94454 7.92796 10.0909 8 10.2461 8H21C21.2761 8 21.5 8.22386 21.5 8.5V18.5C21.5 18.7761 21.2761 19 21 19H3.5C3.22386 19 3 18.7761 3 18.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
