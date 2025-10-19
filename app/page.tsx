// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Users,
  GraduationCap,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">BrandHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              Built for House of EdTech
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Manage <span className="text-blue-600">2 Million+ Students</span>
            <br />
            Across 6 Brands. One Platform.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unified student lifecycle management with AI-powered insights for
            Be10X, Office Master, ProfitUni, MadAboutSports, SpringPad, and Dr.
            Finance.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
          <div>
            <div className="text-4xl font-bold text-blue-600">2M+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">6</div>
            <div className="text-gray-600">Brands</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">400+</div>
            <div className="text-gray-600">Team Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">₹100Cr+</div>
            <div className="text-gray-600">Revenue</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-600">
            From enrollment to completion, manage the entire student journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Centralized student profiles, enrollment tracking, and
                engagement scoring across all brands
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Real-Time Analytics</CardTitle>
              <CardDescription>
                Multi-brand dashboards with completion rates, attendance
                tracking, and revenue metrics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Predict student dropout risk and get personalized intervention
                recommendations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Course Management</CardTitle>
              <CardDescription>
                Create workshops, manage schedules, track capacity, and assign
                instructors
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>
                Cross-brand course suggestions based on learning patterns and
                goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Automated Workflows</CardTitle>
              <CardDescription>
                Reduce admin time by 15%+ with automated attendance,
                enrollments, and reporting
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              The House of EdTech Challenge
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-red-600">
                  ❌ Before BrandHub
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Low completion rates (5-15%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>High student churn (73%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Fragmented data across 6 brands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Manual attendance tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Missed cross-selling opportunities</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  ✅ With BrandHub
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>40%+ completion rate (167% improvement)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>50% retention (85% improvement)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Unified view across all brands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Real-time attendance automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>20% increase in cross-brand enrollment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your EdTech Operations?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join House of EdTech in managing 2M+ students efficiently
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            Built with ❤️ for House of EdTech by{" "}
            <a
              href="https://linkedin.com/in/mohd-ashhar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Mohd Ashhar
            </a>
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <a
              href="https://github.com/Mohd-Ashhar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mohd-ashhar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
