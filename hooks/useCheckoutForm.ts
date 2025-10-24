"use client";

import {useState} from "react";

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

// フォームのバリデーションと送信処理に特化したフック
export function useCheckoutForm() {
  const [errors, setErrors] = useState<FormErrors>({});

  // 指定フィールドのエラーメッセージをクリアする
  const clearFieldError = (field: RequiredField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const nextErrors = {...prev};
      delete nextErrors[field];
      return nextErrors;
    });
  };

  // 入力値から必須項目のエラーを抽出する
  const validateForm = (formData: FormData): FormErrors => {
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

    return newErrors;
  };

  // バリデーション通過時に送信成功を知らせる
  const handleSubmit = (formData: FormData) => {
    const newErrors = validateForm(formData);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    clearFieldError,
    validateForm,
    handleSubmit,
  };
}
