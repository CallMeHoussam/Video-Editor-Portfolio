'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PortfolioData,
  Project,
  Folder,
  SiteSettings,
  Service,
  WorkExperience,
  VideoProvider
} from '@/types/portfolio';
import { parseVideoUrl, normalizeVideoProvider } from '@/lib/video-utils';
import { VideoThumbnail } from './VideoThumbnail';
import {
  Plus,
  Trash2,
  Edit3,
  Star,
  Check,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Film,
  Folder as FolderIcon,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Sparkles,
  Info,
  Layers,
  Save,
  X,
  User,
  Briefcase,
  Wrench,
  Phone,
  Settings,
  Globe,
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface StudioDashboardProps {
  initialData?: PortfolioData | null;
}

type TabType =
  | 'videos'
  | 'folders'
  | 'hero'
  | 'about'
  | 'services'
  | 'experience'
  | 'contact'
  | 'visibility';

export function StudioDashboard({ initialData }: StudioDashboardProps) {
  // Data state
  const [data, setData] = useState<PortfolioData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [activeTab, setActiveTab] = useState<TabType>('videos');

  // Filter & Search
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Video Form Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video Form Fields (Essential 7 fields + expandable advanced)
  const [formTitle, setFormTitle] = useState('');
  const [formFolderId, setFormFolderId] = useState('general');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);

  // Expandable Advanced Options for Videos
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formAspectRatio, setFormAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());

  // URL Real-time Validation State
  const [urlInfo, setUrlInfo] = useState<{
    valid: boolean;
    provider: string;
    notice?: string;
    error?: string;
    thumbnailUrl?: string;
  } | null>(null);

  // Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');

  // Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'project' | 'folder' | 'service' | 'experience';
    id: string;
    title: string;
  } | null>(null);

  // -------------------------------------------------------------
  // HERO & SHOWREEL FORM STATE
  // -------------------------------------------------------------
  const [heroHeadlineEn, setHeroHeadlineEn] = useState('');
  const [heroHeadlineFr, setHeroHeadlineFr] = useState('');
  const [heroSubheadlineEn, setHeroSubheadlineEn] = useState('');
  const [heroSubheadlineFr, setHeroSubheadlineFr] = useState('');
  const [availableBadgeEn, setAvailableBadgeEn] = useState('');
  const [availableBadgeFr, setAvailableBadgeFr] = useState('');
  const [heroLocation, setHeroLocation] = useState('');
  const [showreelEnabled, setShowreelEnabled] = useState(false);
  const [showreelVideoUrl, setShowreelVideoUrl] = useState('');
  const [showreelPoster, setShowreelPoster] = useState('');
  const [showreelTitleEn, setShowreelTitleEn] = useState('');
  const [showreelTitleFr, setShowreelTitleFr] = useState('');

  // -------------------------------------------------------------
  // ABOUT & BIO FORM STATE
  // -------------------------------------------------------------
  const [editorName, setEditorName] = useState('');
  const [editorTitleEn, setEditorTitleEn] = useState('');
  const [editorTitleFr, setEditorTitleFr] = useState('');
  const [bioSummaryEn, setBioSummaryEn] = useState('');
  const [bioSummaryFr, setBioSummaryFr] = useState('');
  const [cvFileEn, setCvFileEn] = useState('');
  const [cvFileFr, setCvFileFr] = useState('');

  // -------------------------------------------------------------
  // SERVICES & SKILLS FORM STATE
  // -------------------------------------------------------------
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);

  // -------------------------------------------------------------
  // EXPERIENCE FORM STATE
  // -------------------------------------------------------------
  const [experiencesList, setExperiencesList] = useState<WorkExperience[]>([]);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);

  // -------------------------------------------------------------
  // CONTACT & WHATSAPP FORM STATE
  // -------------------------------------------------------------
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappStarterEn, setWhatsappStarterEn] = useState('');
  const [whatsappStarterFr, setWhatsappStarterFr] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // -------------------------------------------------------------
  // SECTION VISIBILITY FORM STATE
  // -------------------------------------------------------------
  const [visibilityHero, setVisibilityHero] = useState(true);
  const [visibilityShowreel, setVisibilityShowreel] = useState(false);
  const [visibilityPortfolio, setVisibilityPortfolio] = useState(true);
  const [visibilityServices, setVisibilityServices] = useState(true);
  const [visibilityAbout, setVisibilityAbout] = useState(true);
  const [visibilityExperience, setVisibilityExperience] = useState(true);
  const [visibilityContact, setVisibilityContact] = useState(true);

  // Load portfolio data if not passed in props
  useEffect(() => {
    fetchData();
  }, []);

  // Sync form states whenever data is updated or loaded
  useEffect(() => {
    if (!data) return;

    const s = data.settings;
    if (s) {
      setHeroHeadlineEn(s.heroHeadline?.en || 'I TURN IDEAS INTO VISUAL EXPERIENCES.');
      setHeroHeadlineFr(s.heroHeadline?.fr || 'JE TRANSFORME LES IDÉES EN EXPÉRIENCES VISUELLES.');
      setHeroSubheadlineEn(s.heroSubheadline?.en || s.editorTitle?.en || '');
      setHeroSubheadlineFr(s.heroSubheadline?.fr || s.editorTitle?.fr || '');
      setAvailableBadgeEn(s.availableBadge?.en || 'Available for Q4/Q1 Projects');
      setAvailableBadgeFr(s.availableBadge?.fr || 'Disponible pour projets Q4/Q1');
      setHeroLocation(s.location || 'Casablanca, Morocco');

      setShowreelEnabled(s.showreel?.enabled ?? Boolean(s.showreel?.videoUrl?.trim()));
      setShowreelVideoUrl(s.showreel?.videoUrl || '');
      setShowreelPoster(s.showreel?.poster || '');
      setShowreelTitleEn(s.showreel?.title?.en || 'Evoless Showreel');
      setShowreelTitleFr(s.showreel?.title?.fr || 'Bande Démo Evoless');

      setEditorName(s.editorName || 'Houssam Elmsafer');
      setEditorTitleEn(s.editorTitle?.en || 'Creative Video Editor & Motion Designer');
      setEditorTitleFr(s.editorTitle?.fr || 'Monteur Vidéo Créatif & Motion Designer');
      setBioSummaryEn(s.bioSummary?.en || '');
      setBioSummaryFr(s.bioSummary?.fr || '');
      setCvFileEn(s.cvFiles?.en || '/files/cv/Houssam_CV_ENG.pdf');
      setCvFileFr(s.cvFiles?.fr || '/files/cv/Houssam_CV_FRA.pdf');

      setContactPhone(s.phone || '+212 774-288879');
      setWhatsappNumber(s.whatsappNumber || '212774288879');
      setWhatsappStarterEn(s.whatsappStarterMessage?.en || "Hi Houssam, I'd like to discuss a video editing project.");
      setWhatsappStarterFr(s.whatsappStarterMessage?.fr || "Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo.");
      setContactEmail(s.contactEmail || 'elmsaferhoussam@gmail.com');
      setLinkedInUrl(s.linkedInUrl || '');
      setInstagramUrl(s.instagramUrl || '');
      setXUrl(s.xUrl || '');
      setYoutubeUrl(s.youtubeUrl || '');

      const vis = s.sectionsVisibility || {};
      setVisibilityHero(vis.hero !== false);
      setVisibilityShowreel(s.showreel?.enabled ?? Boolean(s.showreel?.videoUrl?.trim()));
      setVisibilityPortfolio(vis.portfolio !== false);
      setVisibilityServices(vis.services !== false);
      setVisibilityAbout(vis.about !== false);
      setVisibilityExperience(vis.experience !== false);
      setVisibilityContact(vis.contact !== false);
    }

    if (data.services) {
      setServicesList(data.services);
    }
    if (data.experiences) {
      setExperiencesList(data.experiences);
    }
  }, [data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/data', { cache: 'no-store' });
      if (res.ok) {
        const fetched = await res.json();
        setData(fetched);
      } else if (res.status === 401) {
        window.location.reload();
      }
    } catch {
      showFeedback('error', 'Failed to connect to portfolio database.');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/cms/auth', { method: 'DELETE' });
      window.location.href = '/studio';
    } catch {
      window.location.reload();
    }
  };

  // -------------------------------------------------------------
  // SAVE SITE SETTINGS (Generic Handler)
  // -------------------------------------------------------------
  const handleSaveSettings = async (partialSettings: Partial<SiteSettings>, successMessage: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialSettings)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showFeedback('success', successMessage);
        fetchData();
      } else {
        showFeedback('error', result.message || 'Failed to update settings.');
      }
    } catch {
      showFeedback('error', 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Hero & Showreel
  const handleSaveHeroAndShowreel = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = showreelVideoUrl.trim() ? parseVideoUrl(showreelVideoUrl.trim()) : null;

    const payload: Partial<SiteSettings> = {
      heroHeadline: { en: heroHeadlineEn.trim(), fr: heroHeadlineFr.trim() },
      heroSubheadline: { en: heroSubheadlineEn.trim(), fr: heroSubheadlineFr.trim() },
      availableBadge: { en: availableBadgeEn.trim(), fr: availableBadgeFr.trim() },
      location: heroLocation.trim(),
      showreel: {
        enabled: showreelEnabled,
        provider: parsed?.valid ? normalizeVideoProvider(parsed.provider) : 'placeholder',
        videoUrl: showreelVideoUrl.trim(),
        poster: showreelPoster.trim(),
        title: { en: showreelTitleEn.trim(), fr: showreelTitleFr.trim() }
      }
    };

    await handleSaveSettings(payload, 'Hero section & Showreel settings saved successfully!');
  };

  // Save About & Bio
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<SiteSettings> = {
      editorName: editorName.trim(),
      editorTitle: { en: editorTitleEn.trim(), fr: editorTitleFr.trim() },
      bioSummary: { en: bioSummaryEn.trim(), fr: bioSummaryFr.trim() },
      cvFiles: { en: cvFileEn.trim(), fr: cvFileFr.trim() }
    };

    await handleSaveSettings(payload, 'About section & Biography saved successfully!');
  };

  // Save Contact & WhatsApp
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<SiteSettings> = {
      phone: contactPhone.trim(),
      whatsappNumber: whatsappNumber.trim().replace(/[^0-9]/g, ''),
      whatsappStarterMessage: { en: whatsappStarterEn.trim(), fr: whatsappStarterFr.trim() },
      contactEmail: contactEmail.trim(),
      linkedInUrl: linkedInUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      xUrl: xUrl.trim(),
      youtubeUrl: youtubeUrl.trim()
    };

    await handleSaveSettings(payload, 'Contact & WhatsApp configuration saved!');
  };

  // Save Section Visibility
  const handleSaveVisibility = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<SiteSettings> = {
      sectionsVisibility: {
        hero: visibilityHero,
        showreel: visibilityShowreel,
        portfolio: visibilityPortfolio,
        services: visibilityServices,
        about: visibilityAbout,
        experience: visibilityExperience,
        contact: visibilityContact
      },
      showreel: {
        ...(data?.settings.showreel || {
          provider: 'placeholder',
          videoUrl: '',
          poster: '',
          title: { en: '', fr: '' }
        }),
        enabled: visibilityShowreel
      }
    };

    await handleSaveSettings(payload, 'Section visibility updated successfully!');
  };

  // -------------------------------------------------------------
  // SAVE FULL DATA (For Services / Experiences)
  // -------------------------------------------------------------
  const handleSaveFullData = async (updatedData: Partial<PortfolioData>, successMsg: string) => {
    if (!data) return;
    try {
      setIsSubmitting(true);
      const merged = { ...data, ...updatedData };
      const res = await fetch('/api/cms/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showFeedback('success', successMsg);
        fetchData();
      } else {
        showFeedback('error', result.message || 'Failed to save changes.');
      }
    } catch {
      showFeedback('error', 'Error connecting to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // VIDEO MANAGEMENT ACTIONS (Simplified 7-field form)
  // -------------------------------------------------------------
  const handleVideoUrlChange = (url: string) => {
    setFormVideoUrl(url);
    if (!url.trim()) {
      setUrlInfo(null);
      return;
    }

    const parsed = parseVideoUrl(url);
    setUrlInfo({
      valid: parsed.valid,
      provider: parsed.provider,
      notice: parsed.notice,
      error: parsed.error,
      thumbnailUrl: parsed.thumbnailUrl
    });

    if (parsed.valid && parsed.thumbnailUrl && !formThumbnail) {
      setFormThumbnail(parsed.thumbnailUrl);
    }
  };

  const handleAutoFetchThumbnail = async () => {
    if (!formVideoUrl.trim()) {
      showFeedback('error', 'Please enter a video URL first.');
      return;
    }

    try {
      const res = await fetch(`/api/video/thumbnail?url=${encodeURIComponent(formVideoUrl.trim())}`);
      const result = await res.json();
      if (result.success && result.thumbnailUrl) {
        setFormThumbnail(result.thumbnailUrl);
        showFeedback('success', 'Thumbnail retrieved successfully!');
      } else if (result.message) {
        showFeedback('info' as any, result.message);
      }
    } catch {
      showFeedback('error', 'Unable to fetch thumbnail from provider.');
    }
  };

  const openAddProjectModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormFolderId(selectedFolderFilter !== 'all' ? selectedFolderFilter : (data?.folders?.[0]?.id || 'general'));
    setFormVideoUrl('');
    setFormThumbnail('');
    setFormDescription('');
    setFormFeatured(false);
    setFormPublished(true);
    setFormAspectRatio('16:9');
    setFormYear(new Date().getFullYear().toString());
    setShowAdvanced(false);
    setUrlInfo(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setFormTitle(project.title.en || project.title.fr || '');
    setFormFolderId(project.folderId || 'general');
    setFormVideoUrl(project.videoUrl || '');
    setFormThumbnail(project.thumbnail || '');
    setFormDescription(project.shortDescription?.en || project.shortDescription?.fr || '');
    setFormFeatured(Boolean(project.featured));
    setFormPublished(project.published !== false);
    setFormAspectRatio(project.aspectRatio || '16:9');
    setFormYear(project.year || new Date().getFullYear().toString());
    setShowAdvanced(false);

    if (project.videoUrl) {
      const parsed = parseVideoUrl(project.videoUrl);
      setUrlInfo({
        valid: parsed.valid,
        provider: parsed.provider,
        notice: parsed.notice,
        error: parsed.error,
        thumbnailUrl: parsed.thumbnailUrl
      });
    } else {
      setUrlInfo(null);
    }

    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showFeedback('error', 'Video title is required.');
      return;
    }

    if (!formVideoUrl.trim()) {
      showFeedback('error', 'Video URL is required.');
      return;
    }

    const parsed = parseVideoUrl(formVideoUrl);
    if (!parsed.valid) {
      showFeedback('error', parsed.error || 'Please provide a valid video link.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<Project> = {
        title: {
          en: formTitle.trim(),
          fr: formTitle.trim()
        },
        shortDescription: {
          en: formDescription.trim(),
          fr: formDescription.trim()
        },
        folderId: formFolderId,
        videoUrl: formVideoUrl.trim(),
        videoProvider: normalizeVideoProvider(parsed.provider),
        thumbnail: formThumbnail.trim(),
        featured: formFeatured,
        published: formPublished,
        aspectRatio: formAspectRatio,
        year: formYear.trim()
      };

      const url = editingProject
        ? `/api/cms/projects/${editingProject.id}`
        : '/api/cms/projects';

      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        showFeedback('success', editingProject ? 'Video updated successfully!' : 'Video added to portfolio!');
        setIsProjectModalOpen(false);
        fetchData();
      } else {
        showFeedback('error', resData.message || 'Failed to save video.');
      }
    } catch {
      showFeedback('error', 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBestOne = async (project: Project) => {
    const updatedFeatured = !project.featured;
    try {
      const res = await fetch(`/api/cms/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: updatedFeatured })
      });

      if (res.ok) {
        showFeedback('success', updatedFeatured ? `Marked "${project.title.en}" as Best One!` : 'Removed Best One status.');
        fetchData();
      } else {
        showFeedback('error', 'Failed to update status.');
      }
    } catch {
      showFeedback('error', 'Error updating status.');
    }
  };

  const handleTogglePublished = async (project: Project) => {
    const updatedStatus = !project.published;
    try {
      const res = await fetch(`/api/cms/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: updatedStatus })
      });

      if (res.ok) {
        showFeedback('success', updatedStatus ? `Published "${project.title.en}"` : `Moved "${project.title.en}" to drafts.`);
        fetchData();
      } else {
        showFeedback('error', 'Failed to update status.');
      }
    } catch {
      showFeedback('error', 'Error updating status.');
    }
  };

  const handleMoveProjectOrder = async (project: Project, direction: 'up' | 'down') => {
    if (!data) return;

    const folderProjects = data.projects
      .filter(p => p.folderId === project.folderId)
      .sort((a, b) => a.order - b.order);

    const index = folderProjects.findIndex(p => p.id === project.id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= folderProjects.length) return;

    const targetProject = folderProjects[targetIndex];

    try {
      await Promise.all([
        fetch(`/api/cms/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetProject.order })
        }),
        fetch(`/api/cms/projects/${targetProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: project.order })
        })
      ]);

      showFeedback('success', 'Order updated.');
      fetchData();
    } catch {
      showFeedback('error', 'Failed to reorder.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback('success', 'Video deleted.');
        setDeleteConfirmation(null);
        fetchData();
      } else {
        showFeedback('error', 'Failed to delete video.');
      }
    } catch {
      showFeedback('error', 'Error deleting video.');
    }
  };

  // -------------------------------------------------------------
  // FOLDER MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const openCreateFolderModal = () => {
    setEditingFolder(null);
    setFolderName('');
    setFolderDesc('');
    setIsFolderModalOpen(true);
  };

  const openEditFolderModal = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name.en || '');
    setFolderDesc(folder.description?.en || '');
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      showFeedback('error', 'Folder name is required.');
      return;
    }

    try {
      const payload = {
        id: editingFolder ? editingFolder.id : undefined,
        name: { en: folderName.trim(), fr: folderName.trim() },
        description: { en: folderDesc.trim(), fr: folderDesc.trim() }
      };

      const url = '/api/cms/folders';
      const method = editingFolder ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showFeedback('success', editingFolder ? 'Folder updated!' : 'Folder created!');
        setIsFolderModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        showFeedback('error', err.message || 'Failed to save folder.');
      }
    } catch {
      showFeedback('error', 'Error saving folder.');
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/folders?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback('success', 'Folder deleted.');
        setDeleteConfirmation(null);
        fetchData();
      } else {
        showFeedback('error', 'Failed to delete folder.');
      }
    } catch {
      showFeedback('error', 'Error deleting folder.');
    }
  };

  const handleMoveFolderOrder = async (folder: Folder, direction: 'up' | 'down') => {
    if (!data || !data.folders) return;

    const folders = [...data.folders].sort((a, b) => a.order - b.order);
    const index = folders.findIndex(f => f.id === folder.id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= folders.length) return;

    const reordered = [...folders];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const reorderIds = reordered.map(f => f.id);

    try {
      const res = await fetch('/api/cms/folders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorderIds })
      });

      if (res.ok) {
        showFeedback('success', 'Folder order updated.');
        fetchData();
      }
    } catch {
      showFeedback('error', 'Failed to reorder folders.');
    }
  };

  const folders = data?.folders || [];
  const projects = data?.projects || [];

  const filteredProjects = projects.filter(project => {
    const matchesFolder = selectedFolderFilter === 'all'
      ? true
      : project.folderId === selectedFolderFilter;

    const titleEn = (project.title.en || '').toLowerCase();
    const client = (project.client || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = query ? titleEn.includes(query) || client.includes(query) : true;
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface-elevated)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-900/30">
            E
          </div>
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg tracking-tight leading-none text-[var(--text-primary)]">
              Evoless Studio
            </h1>
            <span className="text-[10px] font-mono text-purple-400">Website & Content CMS</span>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            title="Log out"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* FEEDBACK TOAST BANNER */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
          <div
            className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
            } backdrop-blur-md`}
          >
            {feedback.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <p className="text-xs font-medium leading-relaxed">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* TAB NAVIGATION BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[var(--border-subtle)] no-scrollbar">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Videos ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('folders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'folders'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <FolderIcon className="w-4 h-4" />
            <span>Folders & Clients ({folders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero & Showreel</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>About & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services & Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Experience</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contact & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'visibility'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Section Visibility</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: VIDEOS MANAGEMENT                                 */}
        {/* ======================================================== */}
        {activeTab === 'videos' && (
          <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <label htmlFor="folder-filter" className="text-xs text-[var(--text-muted)] font-mono">
                  Folder:
                </label>
                <select
                  id="folder-filter"
                  value={selectedFolderFilter}
                  onChange={(e) => setSelectedFolderFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Folders ({projects.length})</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name.en} ({projects.filter(p => p.folderId === f.id).length})
                    </option>
                  ))}
                  <option value="general">
                    General Portfolio ({projects.filter(p => !p.folderId || p.folderId === 'general').length})
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos by title or client..."
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500 max-w-xs"
                />

                <button
                  onClick={openAddProjectModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video</span>
                </button>
              </div>
            </div>

            {/* Videos List */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <Film className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-50" />
                <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                  No videos found
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  {searchQuery ? 'Try adjusting your search query.' : 'Add your first video to this folder.'}
                </p>
                <button
                  onClick={openAddProjectModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => {
                  const folder = folders.find(f => f.id === project.folderId);
                  const folderLabel = folder ? folder.name.en : (project.folderId || 'General Portfolio');

                  return (
                    <div
                      key={project.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-all gap-4 shadow-sm"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-20 h-14 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-black/40 shrink-0 relative">
                          <VideoThumbnail
                            thumbnailUrl={project.thumbnail}
                            title={project.title.en}
                            aspectRatio="16:9"
                            showPlayButton={false}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                              {folderLabel}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {project.videoProvider}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-sm text-[var(--text-primary)] truncate">
                            {project.title.en}
                          </h3>

                          {project.shortDescription?.en && (
                            <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                              {project.shortDescription.en}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                        {/* Reorder Buttons */}
                        <div className="flex items-center border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-elevated)]">
                          <button
                            onClick={() => handleMoveProjectOrder(project, 'up')}
                            title="Move video up"
                            className="p-1.5 hover:text-purple-400 transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveProjectOrder(project, 'down')}
                            title="Move video down"
                            className="p-1.5 hover:text-purple-400 transition-colors border-l border-[var(--border-subtle)] cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Best One Button */}
                        <button
                          onClick={() => handleToggleBestOne(project)}
                          title={project.featured ? 'Featured as Best One' : 'Set as Best One'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            project.featured
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                              : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-amber-300 border border-[var(--border-subtle)]'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-300' : ''}`} />
                          <span className="text-[11px]">{project.featured ? 'Best One' : 'Make Best'}</span>
                        </button>

                        {/* Live / Draft Toggle */}
                        <button
                          onClick={() => handleTogglePublished(project)}
                          title={project.published ? 'Published (visible)' : 'Draft (hidden)'}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            project.published
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {project.published ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditProjectModal(project)}
                          className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-purple-600 hover:text-white border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors cursor-pointer"
                          title="Edit Video"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirmation({
                            type: 'project',
                            id: project.id,
                            title: project.title.en
                          })}
                          className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-rose-600 hover:text-white border border-[var(--border-subtle)] text-rose-400 transition-colors cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FOLDERS & CLIENTS                                 */}
        {/* ======================================================== */}
        {activeTab === 'folders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Portfolio Client Folders
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Organize videos by client, agency, or campaign collection.
                </p>
              </div>

              <button
                onClick={openCreateFolderModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Folder</span>
              </button>
            </div>

            <div className="space-y-3">
              {folders.map(folder => {
                const count = projects.filter(p => p.folderId === folder.id).length;
                const bestOne = projects.find(p => p.folderId === folder.id && p.featured) ||
                  projects.find(p => p.folderId === folder.id);

                return (
                  <div
                    key={folder.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-all gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <FolderIcon className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-base text-[var(--text-primary)] uppercase">
                            {folder.name.en}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                            {count} {count === 1 ? 'Video' : 'Videos'}
                          </span>
                        </div>

                        {folder.description?.en && (
                          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
                            {folder.description.en}
                          </p>
                        )}

                        {bestOne && (
                          <span className="text-[11px] font-mono text-purple-400/80 block mt-1">
                            ★ Best One: {bestOne.title.en}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="flex items-center border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-elevated)]">
                        <button
                          onClick={() => handleMoveFolderOrder(folder, 'up')}
                          title="Move folder up"
                          className="p-1.5 hover:text-purple-400 transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveFolderOrder(folder, 'down')}
                          title="Move folder down"
                          className="p-1.5 hover:text-purple-400 transition-colors border-l border-[var(--border-subtle)] cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        href={`/en/folder/${folder.slug || folder.id}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:text-purple-400 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] transition-colors"
                        title="View folder page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => openEditFolderModal(folder)}
                        className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-purple-600 hover:text-white border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors cursor-pointer"
                        title="Edit Folder"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmation({
                          type: 'folder',
                          id: folder.id,
                          title: folder.name.en
                        })}
                        className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-rose-600 hover:text-white border border-[var(--border-subtle)] text-rose-400 transition-colors cursor-pointer"
                        title="Delete Folder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: HERO & SHOWREEL SETTINGS                          */}
        {/* ======================================================== */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHeroAndShowreel} className="space-y-8 max-w-4xl">
            {/* 1. SHOWREEL VISIBILITY CARD */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-400" />
                    <span>Showreel Video & Visibility</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Toggle your showreel ON or OFF. When OFF, the section is completely omitted from the website without leaving blank spaces.
                  </p>
                </div>

                {/* ON / OFF Switch */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <span className={`text-xs font-bold uppercase tracking-wider ${showreelEnabled ? 'text-purple-400' : 'text-[var(--text-muted)]'}`}>
                    {showreelEnabled ? 'Showreel ON' : 'Showreel OFF'}
                  </span>
                  <input
                    type="checkbox"
                    checked={showreelEnabled}
                    onChange={(e) => setShowreelEnabled(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Showreel Video URL (YouTube, Vimeo, Google Drive, or MP4)
                  </label>
                  <input
                    type="text"
                    value={showreelVideoUrl}
                    onChange={(e) => setShowreelVideoUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or Google Drive share link"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Showreel Poster / Thumbnail Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={showreelPoster}
                    onChange={(e) => setShowreelPoster(e.target.value)}
                    placeholder="/images/showreel-poster.svg or full image URL..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Showreel Title (English)
                    </label>
                    <input
                      type="text"
                      value={showreelTitleEn}
                      onChange={(e) => setShowreelTitleEn(e.target.value)}
                      placeholder="Evoless 2026/2027 Showreel"
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Showreel Title (French)
                    </label>
                    <input
                      type="text"
                      value={showreelTitleFr}
                      onChange={(e) => setShowreelTitleFr(e.target.value)}
                      placeholder="Bande Démo Evoless 2026/2027"
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. HERO HEADLINE & BADGES */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-5">
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Hero Headlines & Availability</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Main Headline (English)
                  </label>
                  <textarea
                    rows={2}
                    value={heroHeadlineEn}
                    onChange={(e) => setHeroHeadlineEn(e.target.value)}
                    placeholder="I TURN IDEAS INTO VISUAL EXPERIENCES."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Main Headline (French)
                  </label>
                  <textarea
                    rows={2}
                    value={heroHeadlineFr}
                    onChange={(e) => setHeroHeadlineFr(e.target.value)}
                    placeholder="JE TRANSFORME LES IDÉES EN EXPÉRIENCES VISUELLES."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Hero Subtitle (English)
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubheadlineEn}
                    onChange={(e) => setHeroSubheadlineEn(e.target.value)}
                    placeholder="High-retention video editing and motion design..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Hero Subtitle (French)
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubheadlineFr}
                    onChange={(e) => setHeroSubheadlineFr(e.target.value)}
                    placeholder="Montage vidéo à haute rétention et motion design..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Availability Badge (EN)
                  </label>
                  <input
                    type="text"
                    value={availableBadgeEn}
                    onChange={(e) => setAvailableBadgeEn(e.target.value)}
                    placeholder="Available for Q4/Q1 Projects"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Availability Badge (FR)
                  </label>
                  <input
                    type="text"
                    value={availableBadgeFr}
                    onChange={(e) => setAvailableBadgeFr(e.target.value)}
                    placeholder="Disponible pour projets Q4/Q1"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Location Badge
                  </label>
                  <input
                    type="text"
                    value={heroLocation}
                    onChange={(e) => setHeroLocation(e.target.value)}
                    placeholder="Casablanca, Morocco"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero & Showreel Settings</span>
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ABOUT & BIO                                       */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <form onSubmit={handleSaveAbout} className="space-y-6 max-w-4xl">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-5">
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                <span>Biography & Professional Identity</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Editor Full Name
                </label>
                <input
                  type="text"
                  value={editorName}
                  onChange={(e) => setEditorName(e.target.value)}
                  placeholder="Houssam Elmsafer"
                  className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Professional Title (English)
                  </label>
                  <input
                    type="text"
                    value={editorTitleEn}
                    onChange={(e) => setEditorTitleEn(e.target.value)}
                    placeholder="Creative Video Editor & Motion Designer"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Professional Title (French)
                  </label>
                  <input
                    type="text"
                    value={editorTitleFr}
                    onChange={(e) => setEditorTitleFr(e.target.value)}
                    placeholder="Monteur Vidéo Créatif & Motion Designer"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Biography Summary (English)
                  </label>
                  <textarea
                    rows={4}
                    value={bioSummaryEn}
                    onChange={(e) => setBioSummaryEn(e.target.value)}
                    placeholder="Video editor with 2 years of professional experience crafting dynamic, conversion-focused edits..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Biography Summary (French)
                  </label>
                  <textarea
                    rows={4}
                    value={bioSummaryFr}
                    onChange={(e) => setBioSummaryFr(e.target.value)}
                    placeholder="Monteur vidéo avec 2 ans d'expérience professionnelle concevant des montages dynamiques..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>

              {/* CV FILE PATHS */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>CV Download Files</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      English CV File Path
                    </label>
                    <input
                      type="text"
                      value={cvFileEn}
                      onChange={(e) => setCvFileEn(e.target.value)}
                      placeholder="/files/cv/Houssam_CV_ENG.pdf"
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      French CV File Path
                    </label>
                    <input
                      type="text"
                      value={cvFileFr}
                      onChange={(e) => setCvFileFr(e.target.value)}
                      placeholder="/files/cv/Houssam_CV_FRA.pdf"
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save About & Bio</span>
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SERVICES & SKILLS                                 */}
        {/* ======================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Services & Capabilities
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Manage the creative offerings displayed in the Services section.
                </p>
              </div>

              <button
                onClick={() => {
                  const newService: Service = {
                    id: `service-${Date.now()}`,
                    slug: `new-service-${Date.now()}`,
                    title: { en: 'New Service', fr: 'Nouveau Service' },
                    tagline: { en: 'Short descriptive tagline', fr: 'Court sous-titre descriptif' },
                    description: { en: 'Detailed service description...', fr: 'Description détaillée du service...' },
                    deliverables: { en: ['Deliverable 1', 'Deliverable 2'], fr: ['Livrable 1', 'Livrable 2'] },
                    tools: ['Premiere Pro', 'After Effects'],
                    highlight: { en: 'Proven campaign result', fr: 'Résultat éprouvé en campagne' },
                    order: servicesList.length + 1
                  };
                  const updated = [...servicesList, newService];
                  setServicesList(updated);
                  handleSaveFullData({ services: updated }, 'New service added!');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-4">
              {servicesList.map((service, index) => {
                const isEditing = editingServiceIndex === index;

                return (
                  <div
                    key={service.id || index}
                    className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 font-mono text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                          {service.title.en}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingServiceIndex(isEditing ? null : index)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 transition-colors"
                        >
                          {isEditing ? 'Close' : 'Edit Service'}
                        </button>

                        <button
                          onClick={() => {
                            const updated = servicesList.filter((_, i) => i !== index);
                            setServicesList(updated);
                            handleSaveFullData({ services: updated }, 'Service removed.');
                          }}
                          className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Title (EN)
                            </label>
                            <input
                              type="text"
                              value={service.title.en}
                              onChange={(e) => {
                                const updated = [...servicesList];
                                updated[index].title.en = e.target.value;
                                setServicesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Title (FR)
                            </label>
                            <input
                              type="text"
                              value={service.title.fr}
                              onChange={(e) => {
                                const updated = [...servicesList];
                                updated[index].title.fr = e.target.value;
                                setServicesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Tagline (EN)
                            </label>
                            <input
                              type="text"
                              value={service.tagline.en}
                              onChange={(e) => {
                                const updated = [...servicesList];
                                updated[index].tagline.en = e.target.value;
                                setServicesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Tagline (FR)
                            </label>
                            <input
                              type="text"
                              value={service.tagline.fr}
                              onChange={(e) => {
                                const updated = [...servicesList];
                                updated[index].tagline.fr = e.target.value;
                                setServicesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                            Tools / Software (comma separated)
                          </label>
                          <input
                            type="text"
                            value={service.tools.join(', ')}
                            onChange={(e) => {
                              const updated = [...servicesList];
                              updated[index].tools = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setServicesList(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveFullData({ services: servicesList }, 'Services updated successfully!')}
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Services</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: WORK EXPERIENCE                                   */}
        {/* ======================================================== */}
        {activeTab === 'experience' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Work Experience History
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Edit professional background positions, roles, and achievements.
                </p>
              </div>

              <button
                onClick={() => {
                  const newExp: WorkExperience = {
                    id: `exp-${Date.now()}`,
                    company: 'New Company / Agency',
                    title: { en: 'Video Editor & Motion Designer', fr: 'Monteur Vidéo' },
                    location: 'Casablanca, Morocco',
                    period: '2026 – Present',
                    responsibilities: {
                      en: ['Key responsibility 1', 'Key responsibility 2'],
                      fr: ['Responsabilité clé 1', 'Responsabilité clé 2']
                    },
                    order: experiencesList.length + 1
                  };
                  const updated = [...experiencesList, newExp];
                  setExperiencesList(updated);
                  handleSaveFullData({ experiences: updated }, 'Experience added!');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiencesList.map((exp, index) => {
                const isEditing = editingExperienceIndex === index;

                return (
                  <div
                    key={exp.id || index}
                    className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                            {exp.company}
                          </h4>
                          <span className="text-xs font-mono text-purple-400">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {exp.title.en} · {exp.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingExperienceIndex(isEditing ? null : index)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 transition-colors"
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>

                        <button
                          onClick={() => {
                            const updated = experiencesList.filter((_, i) => i !== index);
                            setExperiencesList(updated);
                            handleSaveFullData({ experiences: updated }, 'Experience removed.');
                          }}
                          className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-rose-600 text-rose-400 hover:text-white transition-colors"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...experiencesList];
                                updated[index].company = e.target.value;
                                setExperiencesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => {
                                const updated = [...experiencesList];
                                updated[index].location = e.target.value;
                                setExperiencesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Period
                            </label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => {
                                const updated = [...experiencesList];
                                updated[index].period = e.target.value;
                                setExperiencesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Role Title (EN)
                            </label>
                            <input
                              type="text"
                              value={exp.title.en}
                              onChange={(e) => {
                                const updated = [...experiencesList];
                                updated[index].title.en = e.target.value;
                                setExperiencesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                              Role Title (FR)
                            </label>
                            <input
                              type="text"
                              value={exp.title.fr}
                              onChange={(e) => {
                                const updated = [...experiencesList];
                                updated[index].title.fr = e.target.value;
                                setExperiencesList(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveFullData({ experiences: experiencesList }, 'Experiences updated successfully!')}
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Experience</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: CONTACT & WHATSAPP CONFIGURATION                  */}
        {/* ======================================================== */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="space-y-6 max-w-4xl">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-5">
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>Contact Details & WhatsApp Direct Line</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Display Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+212 774-288879"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    WhatsApp Number (Digits only, including country code)
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="212774288879"
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                    Used for direct wa.me links. Do not include spaces or + sign.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    WhatsApp Starter Message (English)
                  </label>
                  <textarea
                    rows={2}
                    value={whatsappStarterEn}
                    onChange={(e) => setWhatsappStarterEn(e.target.value)}
                    placeholder="Hi Houssam, I'd like to discuss a video editing project."
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    WhatsApp Starter Message (French)
                  </label>
                  <textarea
                    rows={2}
                    value={whatsappStarterFr}
                    onChange={(e) => setWhatsappStarterFr(e.target.value)}
                    placeholder="Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo."
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="elmsaferhoussam@gmail.com"
                  className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                />
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Social Channels
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="text"
                      value={linkedInUrl}
                      onChange={(e) => setLinkedInUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/..."
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://www.instagram.com/..."
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                      X (Twitter) URL
                    </label>
                    <input
                      type="text"
                      value={xUrl}
                      onChange={(e) => setXUrl(e.target.value)}
                      placeholder="https://x.com/..."
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                      YouTube Channel URL
                    </label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/@..."
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact & Socials</span>
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 8: SECTION VISIBILITY & THEME                        */}
        {/* ======================================================== */}
        {activeTab === 'visibility' && (
          <form onSubmit={handleSaveVisibility} className="space-y-6 max-w-4xl">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-5">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span>Public Section Visibility</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Control which sections are displayed on the public portfolio website.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Hero Section', desc: 'Main headline, subheadline, CTA buttons, and badges', state: visibilityHero, set: setVisibilityHero },
                  { label: 'Showreel Section', desc: 'Embedded showreel video preview', state: visibilityShowreel, set: setVisibilityShowreel },
                  { label: 'Portfolio & Folders', desc: 'Client collections, folders, and video case studies', state: visibilityPortfolio, set: setVisibilityPortfolio },
                  { label: 'Services & Capabilities', desc: 'Offerings, deliverables, tools, and highlight metrics', state: visibilityServices, set: setVisibilityServices },
                  { label: 'About & Biography', desc: 'Portrait, editor bio, credentials, and CV download files', state: visibilityAbout, set: setVisibilityAbout },
                  { label: 'Experience Timeline', desc: 'Work history positions and agencies', state: visibilityExperience, set: setVisibilityExperience },
                  { label: 'Contact Section', desc: 'WhatsApp conversation card and direct channels', state: visibilityContact, set: setVisibilityContact },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="block text-sm font-bold text-[var(--text-primary)]">
                        {item.label}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {item.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${item.state ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {item.state ? 'VISIBLE' : 'HIDDEN'}
                      </span>
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => item.set(e.target.checked)}
                        className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Visibility Settings</span>
            </button>
          </form>
        )}
      </main>

      {/* ======================================================== */}
      {/* ADD / EDIT VIDEO MODAL (ESSENTIAL FIELDS ONLY)            */}
      {/* ======================================================== */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden my-8 animate-scale-up">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-elevated)]">
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                {editingProject ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-5">
              {/* Field 1: Video Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  1. Video Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. MAMA RAHIK — Product Launch Campaign"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                />
              </div>

              {/* Field 2: Folder / Client */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  2. Client or Folder <span className="text-purple-400">*</span>
                </label>
                <select
                  value={formFolderId}
                  onChange={(e) => setFormFolderId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name.en}
                    </option>
                  ))}
                  <option value="general">General Portfolio (No client folder)</option>
                </select>
              </div>

              {/* Field 3: Video URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  3. Video URL or Source <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={formVideoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="Paste YouTube, Vimeo, Google Drive share link, or direct MP4 URL..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                />

                {urlInfo && (
                  <div className="mt-2 text-xs">
                    {urlInfo.valid ? (
                      <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-start gap-2">
                        <Info className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                        <div>
                          <span className="font-semibold uppercase tracking-wider text-[11px] mr-1.5">
                            [{urlInfo.provider} detected]
                          </span>
                          <span>{urlInfo.notice}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{urlInfo.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Field 4: Thumbnail */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    4. Thumbnail (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFetchThumbnail}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium underline cursor-pointer"
                  >
                    Auto-fetch thumbnail
                  </button>
                </div>
                <input
                  type="text"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="Image URL (leave blank for automatic fallback poster card)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)]"
                />

                <div className="mt-2 flex items-center gap-3">
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-black/40 border border-[var(--border-subtle)] shrink-0">
                    <VideoThumbnail
                      thumbnailUrl={formThumbnail}
                      title={formTitle || 'Preview'}
                      aspectRatio="16:9"
                      showPlayButton={false}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">
                    {formThumbnail
                      ? 'Custom / auto-generated thumbnail preview.'
                      : 'No thumbnail specified. An elegant fallback poster card will be rendered automatically.'}
                  </span>
                </div>
              </div>

              {/* Field 5: Short Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  5. Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief context or key outcome (e.g. 100k+ organic views on launch)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                />
              </div>

              {/* Field 6 & 7: Best One & Published Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] cursor-pointer hover:border-amber-500/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[var(--text-primary)] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Best One</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Feature prominently at top of folder
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] cursor-pointer hover:border-emerald-500/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[var(--text-primary)] flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Published</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Visible to portfolio visitors
                    </span>
                  </div>
                </label>
              </div>

              {/* EXPANDABLE ADVANCED OPTIONS */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-purple-400 transition-colors font-semibold"
                >
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>Advanced Options (Aspect Ratio, Year)</span>
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-2 gap-4 mt-3 p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--text-secondary)] mb-1">
                        Aspect Ratio
                      </label>
                      <select
                        value={formAspectRatio}
                        onChange={(e) => setFormAspectRatio(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                      >
                        <option value="16:9">16:9 (Horizontal)</option>
                        <option value="9:16">9:16 (Vertical Reel)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:5">4:5 (Social Feed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--text-secondary)] mb-1">
                        Release Year
                      </label>
                      <input
                        type="text"
                        value={formYear}
                        onChange={(e) => setFormYear(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingProject ? 'Save Changes' : 'Add Video'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOLDER CREATE / EDIT MODAL                                */}
      {/* ======================================================== */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-elevated)]">
              <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
                {editingFolder ? 'Edit Folder' : 'Create New Folder'}
              </h2>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Folder Name <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. TUCOSO or NAZA AGENCY"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={folderDesc}
                  onChange={(e) => setFolderDesc(e.target.value)}
                  placeholder="e.g. Commercial video edits engineered for high e-commerce conversion..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-purple-500 focus:outline-none text-sm text-[var(--text-primary)] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  {editingFolder ? 'Save Changes' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                 */}
      {/* ======================================================== */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">
              Delete {deleteConfirmation.type === 'project' ? 'Video' : 'Folder'}?
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-[var(--text-primary)]">"{deleteConfirmation.title}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (deleteConfirmation.type === 'project') {
                    handleDeleteProject(deleteConfirmation.id);
                  } else {
                    handleDeleteFolder(deleteConfirmation.id);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
