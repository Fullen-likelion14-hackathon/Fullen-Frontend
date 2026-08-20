interface RequestTextBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RequestTextBox({ value, onChange }: RequestTextBoxProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="요청사항을 입력해주세요"
      className="h-68 w-full resize-none rounded-xl border-2 border-[#D8CCC1] bg-white p-4 text-base text-[#192C44] outline-none focus:border-[#192C44]"
    />
  );
}
