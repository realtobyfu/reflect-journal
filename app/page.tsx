'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, TrendingUp, Shield, Feather, Sparkles, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();

  // If user is authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Feather className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900">Reflect</h1>
          </div>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold mb-4 text-slate-900">
            Your Daily Companion for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"> Mindful Reflection</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Capture your thoughts, track your emotional journey, and discover meaningful patterns in your daily reflections
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Feather className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          <div className="text-center group">
            <div className="bg-white/80 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200 group-hover:shadow-lg transition-all">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2 text-slate-900">Daily Journaling</h3>
            <p className="text-slate-600">
              Write freely with guided prompts tailored to your mood and mindset
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-white/80 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200 group-hover:shadow-lg transition-all">
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2 text-slate-900">AI Insights</h3>
            <p className="text-slate-600">
              Get personalized reflections and discover themes in your writing journey
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-white/80 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200 group-hover:shadow-lg transition-all">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2 text-slate-900">Track Progress</h3>
            <p className="text-slate-600">
              Visualize your emotional journey and celebrate personal growth
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-white/80 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200 group-hover:shadow-lg transition-all">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-semibold mb-2 text-slate-900">Private & Secure</h3>
            <p className="text-slate-600">
              Your thoughts are safe with end-to-end encryption and privacy-first design
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-24 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Experience Mindful Reflection</h3>
            <p className="text-slate-600">See how Reflect helps you build a meaningful journaling practice</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-slate-700 font-medium">Interactive preview coming soon</p>
              <p className="text-slate-500 text-sm mt-2">Get started today to explore all features</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 