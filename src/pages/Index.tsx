import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { InteractiveMapPreview } from "@/components/home/InteractiveMapPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeatureCards />
      <InteractiveMapPreview />
      <CTASection />
    </Layout>
  );
}
