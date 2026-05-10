import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaycheckCalculatorClient from "../PaycheckCalculatorClient";
import { getUsStateBySlug, usPaycheckStates } from "@/lib/us-paycheck-data";

type Props = {
  params: Promise<{ state: string }>;
};

export async function generateStaticParams() {
  return usPaycheckStates.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateProfile = getUsStateBySlug(state);

  if (!stateProfile) {
    return {
      title: "State Paycheck Calculator | Softzar",
    };
  }

  return {
    title: `${stateProfile.name} Paycheck Calculator - State + Federal Net Pay`,
    description: `Estimate take-home pay in ${stateProfile.name}. Includes federal brackets, FICA, and ${stateProfile.name} withholding assumptions for salary and hourly workers.`,
    keywords: [
      `${stateProfile.name.toLowerCase()} paycheck calculator`,
      `${stateProfile.name.toLowerCase()} salary calculator`,
      `${stateProfile.name.toLowerCase()} take home pay`,
      `${stateProfile.name.toLowerCase()} withholding calculator`,
      "us paycheck calculator by state",
      "federal and state tax estimator",
      "net pay calculator",
      "paycheck planning tool",
    ],
    openGraph: {
      title: `${stateProfile.name} Paycheck Calculator`,
      description: `Plan net pay in ${stateProfile.name} with state + federal paycheck estimates.`,
      type: "website",
      url: `https://softzar.com/us-paycheck-calculator/${stateProfile.slug}/`,
    },
    alternates: {
      canonical: `https://softzar.com/us-paycheck-calculator/${stateProfile.slug}/`,
    },
  };
}

export default async function USPaycheckStatePage({ params }: Props) {
  const { state } = await params;
  const stateProfile = getUsStateBySlug(state);

  if (!stateProfile) {
    notFound();
  }

  return <PaycheckCalculatorClient defaultStateCode={stateProfile.code} stateLanding={stateProfile} />;
}
