import { CustomButton } from "@/components/Button";
import { CustomInput } from "@/components/Input";
import { Message } from "@/components/Message";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      <main className="mx-auto max-w-3xl px-16 py-32">
        <h1 className="text-2xl font-bold">ご購入手続き</h1>

        <form className="mt-10 flex flex-col gap-10">
          <section className="flex flex-col gap-6">
            <h2 className="text-lg font-bold">配送先情報</h2>

            {/* 配送先情報フォーム */}
            <div className="flex flex-col gap-5 border border-gray-200 p-6">
              <Message variant="warning">
                ※配送先住所に誤りがある場合は、住所不明のため配送不可となります。送付先ご住所・郵便番号に誤りがないか十分にご確認をお願いいたします。
              </Message>

              <InputSection title="氏名" required={true}>
                <div className="flex gap-2">
                  <CustomInput placeholder="姓" />
                  <CustomInput placeholder="名" />
                </div>
              </InputSection>

              <InputSection title="電話番号" required={true}>
                <CustomInput placeholder="電話番号" />
              </InputSection>

              <InputSection title="郵便番号" required={true}>
                <CustomInput placeholder="郵便番号" />
              </InputSection>

              <InputSection title="都道府県" required={true}>
                <CustomInput placeholder="都道府県" />
              </InputSection>

              <InputSection title="市区町村" required={true}>
                <CustomInput placeholder="市区町村" />
              </InputSection>

              <InputSection title="番地" required={true}>
                <CustomInput placeholder="番地" />
              </InputSection>

              <InputSection title="建物名・部屋番号" required={false}>
                <CustomInput placeholder="建物名・部屋番号" />
              </InputSection>
            </div>
          </section>

          {/* お支払い方法 */}
          <section className="flex flex-col gap-6">
            <h2 className="text-lg font-bold">お支払い方法</h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  value: "credit_card",
                  label:
                    "クレジットカード（Visa, MasterCard, JCB, American Express）",
                },
                {
                  value: "convenience_store",
                  label: "コンビニ決済",
                },
                {
                  value: "carrier_payment",
                  label: "キャリア決済",
                },
              ].map((paymentMethod) => (
                <label
                  className="flex gap-2 border border-gray-300 p-3"
                  key={paymentMethod.value}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={paymentMethod.value}
                  />
                  <span className="text-sm">{paymentMethod.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* フォームナビゲーションボタン */}
          <div className="mx-auto flex w-full max-w-xs flex-col gap-2">
            <CustomButton>次へ進む</CustomButton>
            <CustomButton variant="white">戻る</CustomButton>
          </div>
        </form>
      </main>
    </div>
  );
}

type InputSectionProps = {
  title: string;
  required: boolean;
  children: React.ReactNode;
};
const InputSection = ({ title, required, children }: InputSectionProps) => {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h3 className="text-xs">{title}</h3>
        {required && (
          <div className="flex items-center justify-center rounded-sm bg-red-500 px-0.5">
            <span className="text-xs text-white">必須</span>
          </div>
        )}
      </div>
      {children}
    </section>
  );
};
