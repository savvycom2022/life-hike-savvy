import React, { useMemo } from "react";
import PageHeader from "@/components/page-header";
import PaymentBox from "@/components/payment-box";
import Button from "@/atomics/button";
import { useRouter } from "next/router";
import styles from "@/styles/home.module.css";

export default function ProductPayment() {
  const router = useRouter();
  return (
    <main>
      <PageHeader title="Payment Page" />
      <div className="m-auto w-90">
        <br />
        <div className={styles['back-button-container']}>
          <Button onClick={() => router.push(`/`)}>Back to Home</Button>
        </div>
        <PaymentBox />
      </div>
    </main>
  );
}
