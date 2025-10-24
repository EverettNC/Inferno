/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


/**
 * Learning Hub - The Comprehensive Learning Journey Tracker 🎓🧠
 * 
 * Shows both client's learning progress AND Inferno's autonomous learning
 * including behavioral capture analytics and therapy progress tracking
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  TrendingUp,
  BookOpen,
  Target,
  Activity,
  Heart,
  Music,
  Camera,
  Mic,
  Zap,
  Award,
  Users,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface LearningMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'behavioral' | 'emotional' | 'therapeutic' | 'engagement';
}

interface TherapyModule {
  id: string;
  name: string;
  type: 'CBT' | 'EMDR' | 'CPT' | 'PE' | 'ART' | 'Music Therapy';
  progress: number;
  sessions: number;
  breakthroughs: string[];
  lastSession: Date;
  nextMilestone: string;
}

interface InfernoLearningUpdate {
  id: string;
  topic: string;
  source: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  category: 'research' | 'behavioral' | 'therapeutic' | 'music';
}

export default function LearningHubPage() {
  const [clientMetrics, setClientMetrics] = useState<LearningMetric[]>([]);
  const [therapyModules, setTherapyModules] = useState<TherapyModule[]>([]);
  const [infernoUpdates, setInfernoUpdates] = useState<InfernoLearningUpdate[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    // Initialize sample client learning data
    setClientMetrics([
      {
        id: '1',
        name: 'Emotional Regulation',
        value: 78,
        target: 85,
        unit: '%',
        trend: 'up',
        category: 'emotional'
      },
      {
        id: '2', 
        name: 'Grounding Technique Mastery',
        value: 12,
        target: 15,
        unit: 'techniques',
        trend: 'up',
        category: 'therapeutic'
      },
      {
        id: '3',
        name: 'Session Engagement',
        value: 92,
        target: 90,
        unit: '%',
        trend: 'stable',
        category: 'engagement'
      },
      {
        id: '4',
        name: 'Trauma Response Management',
        value: 71,
        target: 80,
        unit: '%',
        trend: 'up',
        category: 'behavioral'
      },
      {
        id: '5',
        name: 'Music Therapy Integration',
        value: 85,
        target: 75,
        unit: '%',
        trend: 'up',
        category: 'therapeutic'
      }
    ]);

    // Initialize therapy modules
    setTherapyModules([
      {
        id: '1',
        name: 'Cognitive Behavioral Therapy',
        type: 'CBT',
        progress: 65,
        sessions: 8,
        breakthroughs: ['Identified cognitive distortions', 'Improved thought challenging'],
        lastSession: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextMilestone: 'Master cognitive restructuring techniques'
      },
      {
        id: '2',
        name: 'Music Therapy Integration',
        type: 'Music Therapy',
        progress: 78,
        sessions: 12,
        breakthroughs: ['Connected with healing songs', 'Reduced anxiety through rhythm'],
        lastSession: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextMilestone: 'Create personal therapeutic playlist'
      },
      {
        id: '3',
        name: 'EMDR Processing',
        type: 'EMDR',
        progress: 45,
        sessions: 4,
        breakthroughs: ['Successful bilateral stimulation response'],
        lastSession: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextMilestone: 'Process core traumatic memory'
      }
    ]);

    // Initialize Inferno learning updates
    setInfernoUpdates([
      {
        id: '1',
        topic: 'New EMDR Research - Bilateral Audio Stimulation',
        source: 'Cleveland Clinic EMDR Research',
        confidence: 0.94,
        impact: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        category: 'research'
      },
      {
        id: '2',
        topic: 'Client Response Pattern: Music Preference Analysis',
        source: 'Behavioral Capture System',
        confidence: 0.87,
        impact: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        category: 'behavioral'
      },
      {
        id: '3',
        topic: 'Trauma-Informed Music Therapy Protocol Update',
        source: 'American Music Therapy Association',
        confidence: 0.92,
        impact: 'critical',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        category: 'therapeutic'
      }
    ]);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavioral': return <Activity className="h-4 w-4" />;
      case 'emotional': return <Heart className="h-4 w-4" />;
      case 'therapeutic': return <Brain className="h-4 w-4" />;
      case 'engagement': return <Target className="h-4 w-4" />;
      case 'research': return <BookOpen className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-3 w-3 text-gray-500 rotate-90" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-500" />
              Learning Hub - Comprehensive Journey Tracking
            </CardTitle>
            <CardDescription>
              Monitor your therapeutic progress while Inferno continuously learns and adapts
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="client" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Your Learning Journey
            </TabsTrigger>
            <TabsTrigger value="inferno" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Inferno's Learning
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Advanced Analytics
            </TabsTrigger>
          </TabsList>

          {/* Client Learning Journey */}
          <TabsContent value="client" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Learning Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clientMetrics.map((metric) => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(metric.category)}
                          <span className="text-sm font-medium">{metric.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm font-mono">
                            {metric.value}/{metric.target} {metric.unit}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Therapy Modules Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Therapy Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {therapyModules.map((module) => (
                    <div key={module.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{module.name}</div>
                          <div className="text-xs text-gray-600">
                            {module.sessions} sessions • {module.type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{module.progress}%</div>
                          <Progress value={module.progress} className="h-1 w-16" />
                        </div>
                      </div>
                      
                      {module.breakthroughs.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-600 mb-1">Recent Breakthroughs:</div>
                          {module.breakthroughs.map((breakthrough, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {breakthrough}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Next: {module.nextMilestone}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Behavioral Capture Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Behavioral Capture Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-gray-600">Session Engagement</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Camera className="h-3 w-3" />
                      <span className="text-xs">Visual Analysis</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">73%</div>
                    <div className="text-sm text-gray-600">Emotional Stability</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Mic className="h-3 w-3" />
                      <span className="text-xs">Voice Analysis</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-gray-600">Coping Strategy Usage</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Brain className="h-3 w-3" />
                      <span className="text-xs">Behavioral Patterns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inferno's Learning */}
          <TabsContent value="inferno" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Learning Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Recent Learning Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {infernoUpdates.map((update) => (
                    <div key={update.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{update.topic}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Source: {update.source}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {getCategoryIcon(update.category)}
                            <Badge variant={getImpactColor(update.impact)}>
                              {update.impact} impact
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {(update.confidence * 100).toFixed(0)}% confidence
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Learning Modules Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    AI Learning Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
                      <div className="text-sm font-medium">Music Therapy</div>
                      <div className="text-xs text-gray-600">v2.1 • Active</div>
                      <div className="text-xs text-green-600">94% confidence</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <div className="text-sm font-medium">Trauma Processing</div>
                      <div className="text-xs text-gray-600">v3.0 • Active</div>
                      <div className="text-xs text-blue-600">91% confidence</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-500">
                      <div className="text-sm font-medium">Behavioral Analysis</div>
                      <div className="text-xs text-gray-600">v1.8 • Updating</div>
                      <div className="text-xs text-purple-600">88% confidence</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                      <div className="text-sm font-medium">Emotion Recognition</div>
                      <div className="text-xs text-gray-600">v2.3 • Active</div>
                      <div className="text-xs text-orange-600">96% confidence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Research Sources */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Research Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Medical Databases</div>
                    <div className="text-xs text-gray-600">PubMed, PMC, Cochrane</div>
                    <Badge variant="outline" className="text-xs mt-1">Daily Updates</Badge>
                  </div>
                  <div>
                    <div className="font-medium">Trauma Research</div>
                    <div className="text-xs text-gray-600">VA, APA, NIMH</div>
                    <Badge variant="outline" className="text-xs mt-1">Weekly Updates</Badge>
                  </div>
                  <div>
                    <div className="font-medium">Music Therapy</div>
                    <div className="text-xs text-gray-600">AMTA, NYU, Cleveland</div>
                    <Badge variant="outline" className="text-xs mt-1">Weekly Updates</Badge>
                  </div>
                  <div>
                    <div className="font-medium">Clinical Trials</div>
                    <div className="text-xs text-gray-600">ClinicalTrials.gov</div>
                    <Badge variant="outline" className="text-xs mt-1">Daily Updates</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Analytics */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Progress Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="text-gray-500">
                    📊 Advanced analytics visualization would appear here
                    <br />
                    Showing progress trends, correlation analysis, and predictive insights
                  </div>
                </CardContent>
              </Card>

              {/* Correlation Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Therapy Effectiveness
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="text-gray-500">
                    🎯 Correlation analysis between different therapy modules
                    <br />
                    Music therapy showing 23% boost in emotional regulation
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Music className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Music Session</div>
                  <div className="text-xs text-gray-600">Based on current emotional state</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Brain className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">CBT Practice</div>
                  <div className="text-xs text-gray-600">Cognitive restructuring exercises</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Heart className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Emotion Check-in</div>
                  <div className="text-xs text-gray-600">Update your emotional state</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}