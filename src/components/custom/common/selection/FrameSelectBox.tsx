import ticketImage from "@/assets/images/patchButtons/ticketword.png";
import stampImage from "@/assets/images/patchButtons/stampword.png";
import labelImage from "@/assets/images/patchButtons/labelword.png";

export type FrameType = "ticket" | "stamp" | "label";

interface FrameSelectBoxProps {
  selectedFrame: FrameType | null;
  onSelect?: (frame: FrameType) => void;
  readOnly?: boolean;
}

const frameOptions: {
  id: FrameType;
  image: string;
  alt: string;
}[] = [
  {
    id: "ticket",
    image: ticketImage,
    alt: "티켓 프레임",
  },
  {
    id: "stamp",
    image: stampImage,
    alt: "우표 프레임",
  },
  {
    id: "label",
    image: labelImage,
    alt: "라벨 프레임",
  },
];

const FrameSelectBox = ({ selectedFrame, onSelect, readOnly = false }: FrameSelectBoxProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {frameOptions.map((frame) => {
        const isSelected = selectedFrame === frame.id;

        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onSelect?.(frame.id)}
            disabled={readOnly}
            aria-pressed={isSelected}
            className={`flex aspect-square min-w-0 items-center justify-center rounded-xl border-2 bg-white p-2 transition ${
              isSelected ? "border-[#192C44]" : "border-[#D8CCC1]"
            } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          >
            <img src={frame.image} alt={frame.alt} className="h-auto w-full object-contain" />
          </button>
        );
      })}
    </div>
  );
};

export default FrameSelectBox;
