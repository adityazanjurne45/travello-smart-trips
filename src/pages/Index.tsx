import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeatureCards } from "@/components/home/FeatureCards";
import { InteractiveMapPreview } from "@/components/home/InteractiveMapPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <FeatureCards />
      <InteractiveMapPreview />
      <CTASection />
    </Layout>
  );
}
