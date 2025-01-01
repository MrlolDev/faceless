export default function RotationRow() {
  return (
    <div className="overflow-hidden border-y-4 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack py-5 m500:py-4 font-base">
      <div
        className="flex max-w-[99vw]"
        style={{
          animation: "rotation-row 30s linear infinite",
        }}
      >
        {Array(15)
          .fill("xd")
          .map((x, id) => (
            <div className="flex items-center" key={`first-${id}`}>
              <span className="mx-5 text-4xl m800:text-2xl m500:text-xl whitespace-nowrap">
                Faceless Avatar
              </span>
            </div>
          ))}
        {Array(15)
          .fill("xd")
          .map((x, id) => (
            <div className="flex items-center" key={`second-${id}`}>
              <span className="mx-5 text-4xl m800:text-2xl m500:text-xl whitespace-nowrap">
                Faceless Avatar
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
