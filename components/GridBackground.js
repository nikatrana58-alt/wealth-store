export default function GridBackground() {

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }}
      />

    </div>
  );
}