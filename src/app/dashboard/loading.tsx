export default function DashboardLoading() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          className="spin"
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid rgba(0,113,227,0.3)",
            borderTopColor: "#0071E3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ fontSize: "13px", color: "#86868B", fontWeight: 500 }}>
          Loading workspace...
        </span>
      </div>
    </div>
  );
}
