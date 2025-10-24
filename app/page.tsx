"use client";

import {useMemo, useState} from "react";

import {CustomButton} from "@/components/Button";
import {CustomInput} from "@/components/Input";
import {Message} from "@/components/Message";
import {CustomSelect} from "@/components/Select";
import {PREFECTURES} from "@/constants/prefectures";
import {useForm, type PaymentMethod} from "@/hooks/useForm";
import {X} from "lucide-react";

const paymentMethods: Array<{value: PaymentMethod; label: string}> = [
  {
    value: "credit_card",
    label: "クレジットカード（Visa, MasterCard, JCB, American Express）",
  },
  {
    value: "convenience_store",
    label: "コンビニ決済",
  },
  {
    value: "carrier_payment",
    label: "キャリア決済",
  },
];

type ConfirmationDetails = {
  fullName: string;
  phoneNumber: string;
  postalCode: string;
  addressLines: string[];
};

export default function Home() {
  const {
    formData,
    errors,
    handleTextChange,
    handlePaymentMethodChange,
    validateForm,
    submitOrder,
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 購入内容確認モーダルを閉じる
  const closeModal = () => setIsModalOpen(false);

  // 次へ進むボタンをクリックしたときの処理
  const handleNextStep = () => {
    const isValid = validateForm();
    if (!isValid) return;
    setIsModalOpen(true);
  };

  // 注文確定ボタンをクリックしたときの処理
  const handleConfirmOrder = () => {
    const result = submitOrder();
    if (!result.success) return;
    setIsModalOpen(false);
  };

  // 購入内容確認モーダルで表示する配送先情報を取得する
  const confirmationDetails: ConfirmationDetails = useMemo(() => {
    const fullName = [formData.lastName.trim(), formData.firstName.trim()]
      .filter(Boolean)
      .join(" ");

    const mainAddressLine = [
      formData.prefecture.trim(),
      formData.city.trim(),
      formData.address.trim(),
    ]
      .filter(Boolean)
      .join("");

    const buildingLine = formData.building.trim();

    const addressLines = [mainAddressLine, buildingLine].filter((line) => line.length > 0);

    return {
      fullName,
      phoneNumber: formData.phoneNumber.trim(),
      postalCode: formData.postalCode.trim(),
      addressLines,
    };
  }, [formData]);

  // 購入内容確認モーダルで表示する支払い方法を取得する
  const selectedPaymentMethodLabel =
    paymentMethods.find((method) => method.value === formData.paymentMethod)?.label ??
    paymentMethods[0]?.label ?? "";

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      <main className="mx-auto max-w-3xl px-5 py-32">
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
                <div className="flex gap-2 sm:flex-row flex-col">
                  <CustomInput
                    placeholder="姓"
                    value={formData.lastName}
                    onChange={handleTextChange("lastName")}
                    isError={Boolean(errors.lastName)}
                    errorMessage={errors.lastName}
                  />
                  <CustomInput
                    placeholder="名"
                    value={formData.firstName}
                    onChange={handleTextChange("firstName")}
                    isError={Boolean(errors.firstName)}
                    errorMessage={errors.firstName}
                  />
                </div>
              </InputSection>

              <InputSection title="電話番号" required={true}>
                <CustomInput
                  placeholder="電話番号"
                  value={formData.phoneNumber}
                  onChange={handleTextChange("phoneNumber")}
                  isError={Boolean(errors.phoneNumber)}
                  errorMessage={errors.phoneNumber}
                  className="w-full max-w-40"
                  type="tel"
                />
              </InputSection>

              <InputSection title="郵便番号" required={true}>
                <CustomInput
                  placeholder="郵便番号"
                  value={formData.postalCode}
                  onChange={handleTextChange("postalCode")}
                  isError={Boolean(errors.postalCode)}
                  errorMessage={errors.postalCode}
                  className="w-full max-w-24"
                />
              </InputSection>

              <InputSection title="都道府県" required={true}>
                <CustomSelect
                  value={formData.prefecture}
                  onChange={handleTextChange("prefecture")}
                  isError={Boolean(errors.prefecture)}
                  errorMessage={errors.prefecture}
                  className="w-full max-w-40"
                >
                  <option value="">都道府県を選択</option>
                  {PREFECTURES.map((prefecture) => (
                    <option key={prefecture.code} value={prefecture.name}>
                      {prefecture.name}
                    </option>
                  ))}
                </CustomSelect>
              </InputSection>

              <InputSection title="市区町村" required={true}>
                <CustomInput
                  placeholder="市区町村"
                  value={formData.city}
                  onChange={handleTextChange("city")}
                  isError={Boolean(errors.city)}
                  errorMessage={errors.city}
                />
              </InputSection>

              <InputSection title="番地" required={true}>
                <CustomInput
                  placeholder="番地"
                  value={formData.address}
                  onChange={handleTextChange("address")}
                  isError={Boolean(errors.address)}
                  errorMessage={errors.address}
                />
              </InputSection>

              <InputSection title="建物名・部屋番号" required={false}>
                <CustomInput
                  placeholder="建物名・部屋番号"
                  value={formData.building}
                  onChange={handleTextChange("building")}
                />
              </InputSection>
            </div>
          </section>

          {/* お支払い方法 */}
          <section className="flex flex-col gap-6">
            <h2 className="text-lg font-bold">お支払い方法</h2>
            <div className="flex flex-col gap-2">
              {paymentMethods.map((paymentMethod) => (
                <label
                  className="flex gap-2 border border-gray-300 p-3"
                  key={paymentMethod.value}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={paymentMethod.value}
                    checked={formData.paymentMethod === paymentMethod.value}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="text-sm">{paymentMethod.label}</span>
                </label>
              ))}
              {errors.paymentMethod ? (
                <span className="text-xs text-red-600" role="alert">
                  {errors.paymentMethod}
                </span>
              ) : null}
            </div>
          </section>

          {/* フォームナビゲーションボタン */}
          <div className="mx-auto flex w-full max-w-xs flex-col gap-2">
            <CustomButton type="button" onClick={handleNextStep}>
              次へ進む
            </CustomButton>
            <CustomButton type="button" variant="white">
              戻る
            </CustomButton>
          </div>
        </form>
      </main>

      {/* 購入内容確認モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-sm bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h2 className="text-sm font-bold">購入内容確認</h2>
              <button type="button" onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-8 py-6">
              <section>
                <h2 className="text-lg font-bold">お支払い方法</h2>
                <div className="mt-4 border border-gray-300 p-3 text-sm">
                  {selectedPaymentMethodLabel}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold">配送先</h2>
                <div className="mt-4 flex flex-col gap-1 border border-gray-300 p-3 text-xs text-black/80">
                  <p className="text-sm font-bold text-black">{confirmationDetails.fullName} 様</p>
                  <p>{confirmationDetails.phoneNumber}</p>
                  <p>{confirmationDetails.postalCode}</p>
                  {confirmationDetails.addressLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>
              </section>

              <div className="mx-auto flex w-full max-w-56 flex-col gap-3">
                <CustomButton type="button" onClick={handleConfirmOrder}>
                  注文確定する
                </CustomButton>
                <CustomButton
                  type="button"
                  variant="white"
                  onClick={closeModal}
                >
                  戻る
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type InputSectionProps = {
  title: string;
  required: boolean;
  children: React.ReactNode;
};
const InputSection = ({title, required, children}: InputSectionProps) => {
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
