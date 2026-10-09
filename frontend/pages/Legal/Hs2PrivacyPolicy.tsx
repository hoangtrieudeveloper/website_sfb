const COMPANY_NAME = "Công ty Cổ phần Công nghệ SFB";
const COMPANY_LEGAL = `${COMPANY_NAME} (SFBTECH.,JSC)`;
const ADDRESS = "41A ngõ 68, đường Ngọc Thuỵ, phường Ngọc Thuỵ, quận Long Biên, Hà Nội";
const EMAIL = "info@sfb.vn";
const PHONE_DISPLAY = "0888 917 999";
const PHONE_TEL = "+84888917999";

const dataCategories = [
  {
    label: "Tài khoản",
    text: "số điện thoại hoặc tên đăng nhập, mật khẩu, họ tên, email và số điện thoại khi đăng ký.",
  },
  {
    label: "Hồ sơ nhà trường",
    text: "vai trò phụ huynh, học sinh hoặc giáo viên, trường, năm học, lớp, mã học sinh hoặc giáo viên.",
  },
  {
    label: "Học tập",
    text: "điểm, thời khóa biểu, bài tập, file nộp bài, nghỉ phép, phản ánh, bảng tin, thông báo.",
  },
  {
    label: "Học phí",
    text: "các đợt thu và mã QR chuyển khoản. Việc chuyển tiền thực hiện trên ứng dụng ngân hàng của người dùng. HS2 không giữ tiền và không cung cấp ví điện tử.",
  },
  {
    label: "Sức khỏe",
    text: "kết quả đợt khám do nhà trường nhập, gồm chiều cao, cân nặng, thị lực, nhịp tim và thể trạng. Ứng dụng chỉ hiển thị, không chẩn đoán bệnh.",
  },
  {
    label: "Trao đổi",
    text: "danh bạ, nội dung tin nhắn giữa phụ huynh và nhà trường.",
  },
  {
    label: "Camera",
    text: "hình ảnh camera của nhà trường khi tài khoản được cấp quyền xem. Ứng dụng phát trực tiếp, không lưu video trên điện thoại.",
  },
  {
    label: "Ảnh và tệp",
    text: "ảnh chụp hoặc ảnh chọn từ thư viện, cùng tệp đính kèm, chỉ khi người dùng nộp bài tập hoặc gửi phản ánh.",
  },
  {
    label: "Thông báo",
    text: "mã thông báo Firebase Cloud Messaging để gửi thông báo.",
  },
  {
    label: "Sinh trắc học",
    text: "vân tay hoặc khuôn mặt dùng để mở khóa đăng nhập trên máy. Dữ liệu sinh trắc học do hệ điều hành giữ. Máy chủ chỉ nhận một mã đăng nhập sinh trắc học, không nhận ảnh vân tay hay khuôn mặt.",
  },
  {
    label: "Nhật ký kỹ thuật",
    text: "thời điểm đăng nhập, mã lỗi và thông tin thiết bị cần cho việc vận hành.",
  },
];

const devicePermissions = [
  {
    label: "Internet",
    text: "kết nối máy chủ sổ liên lạc.",
  },
  {
    label: "Thông báo",
    text: "nhận tin từ nhà trường.",
  },
  {
    label: "Máy ảnh và thư viện ảnh",
    text: "chụp hoặc chọn ảnh khi nộp bài tập.",
  },
  {
    label: "Micro",
    text: "tìm kiếm giọng nói trong thư viện, nếu người dùng bật tính năng này.",
  },
  {
    label: "Sinh trắc học",
    text: "đăng nhập nhanh trên thiết bị của người dùng.",
  },
];

function SectionTitle({ index, children }: { index: number; children: string }) {
  return (
    <h2 className="mt-10 text-xl font-bold text-[#0F172A] sm:text-2xl">
      {index}. {children}
    </h2>
  );
}

export function Hs2PrivacyPolicy() {
  return (
    <article className="bg-white pb-20 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-3xl px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#006FB3]">
          HS2
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
          Chính sách quyền riêng tư — ứng dụng HS2
        </h1>
        <p className="mt-4 text-base text-[#64748B]">
          Có hiệu lực từ ngày 9 tháng 10 năm 2026
        </p>

        <p className="mt-8 text-base leading-7 text-[#334155]">
          Ứng dụng HS2 (trên Google Play hiển thị là H2S, gói{" "}
          <span className="font-medium text-[#0F172A]">com.hs2_app</span>) là sổ
          liên lạc điện tử do {COMPANY_LEGAL} (“chúng tôi”) cung cấp. Chính sách
          này mô tả dữ liệu ứng dụng xử lý khi phụ huynh, học sinh và giáo viên
          sử dụng HS2.
        </p>

        <SectionTitle index={1}>Chúng tôi là ai</SectionTitle>
        <dl className="mt-4 space-y-2 text-base leading-7 text-[#334155]">
          <div>
            <dt className="inline font-semibold text-[#0F172A]">Đơn vị vận hành: </dt>
            <dd className="inline">{COMPANY_LEGAL}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-[#0F172A]">Địa chỉ: </dt>
            <dd className="inline">{ADDRESS}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-[#0F172A]">Email: </dt>
            <dd className="inline">
              <a href={`mailto:${EMAIL}`} className="text-[#006FB3] hover:underline">
                {EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-[#0F172A]">Điện thoại: </dt>
            <dd className="inline">
              <a href={`tel:${PHONE_TEL}`} className="text-[#006FB3] hover:underline">
                {PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-[#0F172A]">Website: </dt>
            <dd className="inline">
              <a
                href="https://sfb.vn"
                className="text-[#006FB3] hover:underline"
              >
                https://sfb.vn
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Máy chủ sổ liên lạc:{" "}
          <a
            href="https://sllapi.sfb.vn/"
            className="text-[#006FB3] hover:underline"
          >
            https://sllapi.sfb.vn/
          </a>
        </p>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Nhà trường là đơn vị cung cấp và chịu trách nhiệm về hồ sơ học sinh.
          HS2 hiển thị và trao đổi dữ liệu đó theo tài khoản nhà trường cấp.
        </p>

        <SectionTitle index={2}>Dữ liệu ứng dụng xử lý</SectionTitle>
        <ul className="mt-4 space-y-3 text-base leading-7 text-[#334155]">
          {dataCategories.map((item) => (
            <li key={item.label}>
              <span className="font-semibold text-[#0F172A]">{item.label}: </span>
              {item.text}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Ứng dụng không thu thập vị trí GPS để quảng cáo và không bán dữ liệu
          cho bên thứ ba.
        </p>

        <SectionTitle index={3}>Mục đích sử dụng</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Dữ liệu được dùng để đăng nhập, hiển thị thông tin nhà trường cho đúng
          học sinh, nộp bài và trao đổi với giáo viên, gửi thông báo, xem học
          phí, xem camera khi được phép, và bảo vệ tài khoản. Chúng tôi không
          dùng dữ liệu này để quảng cáo theo hành vi.
        </p>

        <SectionTitle index={4}>Quyền trên điện thoại</SectionTitle>
        <ul className="mt-4 space-y-3 text-base leading-7 text-[#334155]">
          {devicePermissions.map((item) => (
            <li key={item.label}>
              <span className="font-semibold text-[#0F172A]">{item.label}: </span>
              {item.text}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Người dùng có thể từ chối quyền trong phần cài đặt của điện thoại. Một
          số chức năng tương ứng sẽ không hoạt động.
        </p>

        <SectionTitle index={5}>Nơi lưu dữ liệu và bên xử lý</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Dữ liệu tài khoản và hồ sơ học sinh được lưu trên máy chủ của chúng tôi
          tại sllapi.sfb.vn. Trên điện thoại, ứng dụng lưu phiên đăng nhập và mã
          sinh trắc học trong bộ nhớ riêng của app.
        </p>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Thông báo đẩy được chuyển qua Firebase Cloud Messaging của Google.
          Google xử lý mã thiết bị để chuyển thông báo theo điều khoản của
          Google.
        </p>

        <SectionTitle index={6}>Thời gian lưu</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Dữ liệu học sinh được lưu trong thời gian nhà trường còn sử dụng sổ
          liên lạc và theo yêu cầu lưu trữ của nhà trường. Tài khoản đã xóa
          trong ứng dụng sẽ được khóa quyền đăng nhập. Bản sao lưu kỹ thuật có
          thể còn trong một thời gian ngắn rồi bị xóa theo chu kỳ sao lưu.
        </p>

        <SectionTitle index={7}>Trẻ em</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          HS2 dùng trong nhà trường, kể cả cấp mầm non. Tài khoản do nhà trường
          hoặc phụ huynh quản lý. Chúng tôi không chủ đích thu thập dữ liệu trẻ
          em ngoài hồ sơ nhà trường cung cấp cho sổ liên lạc, và không dùng dữ
          liệu trẻ em cho quảng cáo.
        </p>

        <SectionTitle index={8}>Chia sẻ dữ liệu</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Chúng tôi chia sẻ dữ liệu với nhà trường mà tài khoản trực thuộc, với
          giáo viên trong phạm vi lớp và chức năng trò chuyện, và với nhà cung
          cấp hạ tầng cần để vận hành (máy chủ và Firebase). Chúng tôi chỉ cung
          cấp dữ liệu cho cơ quan nhà nước khi có yêu cầu hợp pháp.
        </p>

        <SectionTitle index={9}>Bảo mật</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Kết nối máy chủ dùng HTTPS. Mật khẩu không hiển thị lại sau khi lưu.
          Phiên đăng nhập dùng mã JWT có thời hạn.
        </p>

        <SectionTitle index={10}>Quyền của người dùng</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Trong ứng dụng, người dùng có thể đổi mật khẩu, tắt đăng nhập sinh
          trắc học, đăng xuất và xóa tài khoản. Phụ huynh muốn xem, sửa hoặc xóa
          hồ sơ học sinh thì liên hệ nhà trường hoặc email{" "}
          <a href={`mailto:${EMAIL}`} className="text-[#006FB3] hover:underline">
            {EMAIL}
          </a>
          . Chúng tôi phản hồi trong thời hạn theo quy định hiện hành.
        </p>

        <SectionTitle index={11}>Thay đổi chính sách</SectionTitle>
        <p className="mt-4 text-base leading-7 text-[#334155]">
          Khi chính sách thay đổi, chúng tôi cập nhật trang này và ghi ngày hiệu
          lực mới. Việc tiếp tục dùng ứng dụng sau ngày đó là chấp nhận nội dung
          mới.
        </p>

        <SectionTitle index={12}>Liên hệ</SectionTitle>
        <address className="mt-4 space-y-1 text-base not-italic leading-7 text-[#334155]">
          <p className="font-semibold text-[#0F172A]">{COMPANY_NAME}</p>
          <p>{ADDRESS}</p>
          <p>
            Email:{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#006FB3] hover:underline">
              {EMAIL}
            </a>
          </p>
          <p>
            Điện thoại:{" "}
            <a href={`tel:${PHONE_TEL}`} className="text-[#006FB3] hover:underline">
              {PHONE_DISPLAY}
            </a>
          </p>
        </address>
      </div>
    </article>
  );
}
