"use client";

import {ChangeEvent, useState} from "react";

export type PaymentMethod =
  | "credit_card"
  | "convenience_store"
  | "carrier_payment";

export type FormData = {
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

export type RequiredField = Exclude<keyof FormData, "building">;
export type FormErrors = Partial<Record<RequiredField, string>>;

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

const requiredFieldMessages: Record<RequiredField, string> = {
  lastName: "姓を入力してください",
  firstName: "名を入力してください",
  phoneNumber: "電話番号を入力してください",
  postalCode: "郵便番号を入力してください",
  prefecture: "都道府県を入力してください",
  city: "市区町村を入力してください",
  address: "番地を入力してください",
  paymentMethod: "お支払い方法を選択してください",
};

const requiredFields: RequiredField[] = Object.keys(requiredFieldMessages) as RequiredField[];

type SubmitResult = {
  success: boolean;
  data?: FormData;
};

type TextField = Exclude<keyof FormData, "paymentMethod">;

// フォームの状態管理とバリデーション、送信処理を提供する
export function useForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // 指定フィールドのエラーをクリアする
  const clearFieldError = (field: RequiredField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const nextErrors = {...prev};
      delete nextErrors[field];
      return nextErrors;
    });
  };

  // テキスト入力の変更を反映し、必要に応じてエラーを解消する
  const handleTextChange = (field: TextField) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setFormData((prev) => ({...prev, [field]: value}));

      if (field !== "building" && value.trim() !== "") {
        clearFieldError(field as RequiredField);
      }
    };
  };

  // 支払い方法の選択変更を反映する
  const handlePaymentMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as PaymentMethod;
    setFormData((prev) => ({...prev, paymentMethod: value}));
    clearFieldError("paymentMethod");
  };

  // 入力値から必須項目のエラーを抽出する
  const validateForm = () => {
    const newErrors: FormErrors = {};

    requiredFields.forEach((field) => {
      const value = formData[field];

      if (typeof value === "string" && value.trim() === "") {
        newErrors[field] = requiredFieldMessages[field];
        return;
      }

      if (field === "paymentMethod" && !value) {
        newErrors.paymentMethod = requiredFieldMessages.paymentMethod;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // バリデーション通過時に注文データを送信する
  const submitOrder = (): SubmitResult => {
    const isValid = validateForm();
    if (!isValid) return {success: false};

    // 実際の送信処理はここに実装する
    console.info("Submitting order", formData);
    return {success: true, data: formData};
  };

  // フォームの状態と操作を公開する
  return {
    formData,
    errors,
    handleTextChange,
    handlePaymentMethodChange,
    validateForm,
    submitOrder,
  };
}
