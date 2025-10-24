"use client";

import { ChangeEvent, useState } from "react";

export type PaymentMethod =
  | "credit_card"
  | "convenience_store"
  | "carrier_payment";

type FormData = {
  lastName: string;
  firstName: string;
  phoneNumber: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string;
  paymentMethod: PaymentMethod;
};

type RequiredField = Exclude<keyof FormData, "building">;
type FormErrors = Partial<Record<RequiredField, string>>;
type TextField = Exclude<keyof FormData, "paymentMethod">;

const initialFormData: FormData = {
  lastName: "",
  firstName: "",
  phoneNumber: "",
  postalCode: "",
  prefecture: "",
  city: "",
  address: "",
  building: "",
  paymentMethod: "credit_card",
};

type TextInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isError: boolean;
  errorMessage?: string;
};

// チェックアウトフォームの状態とバリデーションを集約管理する
export function useCheckoutForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // モーダルを閉じる操作を提供する
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 指定されたフィールドが必須項目かを判定する
  const isRequiredField = (field: keyof FormData): field is RequiredField => {
    return field !== "building";
  };

  // 指定フィールドのエラーメッセージをクリアする
  const clearFieldError = (field: RequiredField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  // テキスト入力の変更を状態へ反映し、必要に応じてエラーを解消する
  const handleTextChange = (field: TextField) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (isRequiredField(field) && value.trim() !== "") {
        clearFieldError(field);
      }
    };
  };

  // 支払い方法の選択変更を反映する
  const handlePaymentMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as PaymentMethod;
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
    clearFieldError("paymentMethod");
  };

  // 未入力の必須項目を走査し、項目ごとにエラーメッセージを登録する
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "姓を入力してください";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "名を入力してください";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "電話番号を入力してください";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "郵便番号を入力してください";
    }
    if (!formData.prefecture.trim()) {
      newErrors.prefecture = "都道府県を入力してください";
    }
    if (!formData.city.trim()) {
      newErrors.city = "市区町村を入力してください";
    }
    if (!formData.address.trim()) {
      newErrors.address = "番地を入力してください";
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "お支払い方法を選択してください";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // バリデーションに成功した場合のみモーダルを開く
  const handleNextStep = () => {
    const isValid = validateForm();
    if (!isValid) return false;
    setIsModalOpen(true);
    return true;
  };

  // UIコンポーネントで扱いやすい形に値とエラーステータスを整形する
  const getTextFieldProps = (field: TextField): TextInputProps => {
    const isRequired = isRequiredField(field);
    const errorMessage = isRequired ? errors[field] : undefined;

    return {
      value: formData[field],
      onChange: handleTextChange(field),
      isError: isRequired ? Boolean(errorMessage) : false,
      errorMessage,
    };
  };

  return {
    isModalOpen,
    closeModal,
    handleNextStep,
    getTextFieldProps,
    selectedPaymentMethod: formData.paymentMethod,
    handlePaymentMethodChange,
    paymentMethodError: errors.paymentMethod,
  };
}
