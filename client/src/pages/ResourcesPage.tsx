import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Resource } from '@shared/schema';

export default function ResourcesPage() {
  const { isVoiceModeEnabled, speak } = useVoiceContext();

  // Fetch resources from the API
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  // Group resources by type for easier rendering
  const educationalResources = resources?.filter(r => r.category === 'education') || [];
  const videoResources = resources?.filter(r => r.type === 'video') || [];
  const supportResources = resources?.filter(r => r.category === 'support') || [];

  // If voice mode is enabled, speak the introduction
  useEffect(() => {
    if (isVoiceModeEnabled) {
      speak('Resources and Education. Here you can find helpful information about PTSD and anxiety, as well as support resources.');
    }
  }, [isVoiceModeEnabled, speak]);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="mr-3 p-2 rounded-full hover:bg-neutral-100 transition" aria-label="Go back">
            <i className="fas fa-arrow-left text-neutral-600"></i>
          </a>
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-800">Resources & Education</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-5 mb-8 border border-neutral-200">
        {/* Educational Articles */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 text-neutral-800">Understanding PTSD & Anxiety</h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-neutral-600 text-center">Loading resources...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationalResources.map(resource => (
                <div key={resource.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <i className={resource.icon || "fas fa-book"} aria-hidden="true"></i>
                      </div>
                      <h3 className="font-medium text-neutral-800">{resource.title}</h3>
                    </div>
                    <p className="text-neutral-600 text-sm mb-3">
                      {resource.description}
                    </p>
                    <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm font-medium hover:text-primary-700 transition">
                      Read article <i className="fas fa-arrow-right ml-1"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recommended Videos */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 text-neutral-800">Recommended Videos</h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-neutral-600 text-center">Loading videos...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {videoResources.map(video => (
                <div key={video.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 bg-neutral-100 h-48 sm:h-auto flex items-center justify-center">
                      <i className="fas fa-play-circle text-4xl text-neutral-400"></i>
                    </div>
                    <div className="sm:w-3/5 p-4">
                      <h3 className="font-medium text-lg text-neutral-800 mb-1">{video.title}</h3>
                      <p className="text-neutral-600 text-sm mb-3">{video.description}</p>
                      <div className="flex items-center text-sm text-neutral-500">
                        <span className="mr-3"><i className="far fa-clock mr-1"></i> 7:15</span>
                        <span><i className="fas fa-closed-captioning mr-1"></i> Subtitles available</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {videoResources.length === 0 && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-neutral-600 text-center">No videos available at this time.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        {/* Support Groups & Communities */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 text-neutral-800">Support Groups & Communities</h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-neutral-600 text-center">Loading support resources...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {supportResources.map(support => (
                <div key={support.id} className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="font-medium text-neutral-800 mb-1">{support.title}</h3>
                  <p className="text-neutral-600 text-sm mb-2">
                    {support.description}
                  </p>
                  <a href={support.url || '#'} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm hover:text-primary-700 transition">
                    Visit website <i className="fas fa-external-link-alt ml-1"></i>
                  </a>
                </div>
              ))}
              
              {supportResources.length === 0 && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-neutral-600 text-center">No support resources available at this time.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
