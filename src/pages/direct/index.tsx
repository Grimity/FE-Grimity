import DirectPage from "@/components/DirectPage/DirectPage";
import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import { useDeviceStore } from "@/states/deviceStore";

const EmptyChatRoom = () => {
  return (
    <section
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderLeft: "1px solid #e0e0e0",
      }}
    >
      <div>
        <p style={{ textAlign: "center", color: "#888" }}>
          다른 작가에게 사진과 메시지를 보낼 수 있어요
        </p>
        {/* 필요하다면 새 메시지 보내기 버튼 등을 추가할 수 있습니다. */}
      </div>
    </section>
  );
};

const Direct = () => {
  const { isMobile } = useDeviceStore();

  return (
    <AuthLayout>
      <DirectPage />
      {!isMobile && <EmptyChatRoom />}
    </AuthLayout>
  );
};

export default Direct;
