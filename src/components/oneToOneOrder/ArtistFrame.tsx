import artistFrame from "@/assets/images/artistFrame.png";

type ArtistFrameProps = {
  image: string;
  name: string;
  description: string;
};

export default function ArtistFrame({ image, name, description }: ArtistFrameProps) {
  return (
    <div className="w-60 shrink-0  pb-1">
      {/* 프레임 + 작가 이미지, shrink-0 : flex에서 요소 크기 축소 방지*/}
      <div className="relative w-full">
        <img src={artistFrame} alt="작가 프레임" className="w-full" />

        <div className="absolute left-[19%] top-[35%] h-[55%] w-[62%] overflow-hidden rounded-xl">
          <img src={image} alt={name} className="h-full w-f ull object-cover" />
        </div>
      </div>

      {/* 작가 정보 */}
      <div className="my-4 flex flex-col gap-2">
        <p className="text-center text-[20px] font-semibold">{name}</p>
        <p className="mx-auto max-w-55 text-center text-[14px] font-medium leading-5">
          {description}
        </p>
      </div>
    </div>
  );
}
