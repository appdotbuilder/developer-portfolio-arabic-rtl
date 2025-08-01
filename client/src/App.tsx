
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { DeveloperProfile, Skill, Project, ContactInfo, CreateContactMessageInput } from '../../server/src/schema';

function App() {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Contact form state
  const [contactForm, setContactForm] = useState<CreateContactMessageInput>({
    name: '',
    email: '',
    subject: null,
    message: ''
  });

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const [profileData, skillsData, projectsData, contactData] = await Promise.all([
        trpc.getProfile.query(),
        trpc.getSkills.query(),
        trpc.getProjects.query(),
        trpc.getContactInfo.query()
      ]);

      // Since backend handlers are stubs, provide demo data
      setProfile(profileData || {
        id: 1,
        name: 'أحمد محمد',
        title: 'مطور ويب متخصص',
        bio: 'مطور ويب شغوف بالتقنيات الحديثة وتطوير التطبيقات المتقدمة. أتمتع بخبرة واسعة في تطوير المواقع والتطبيقات باستخدام أحدث التقنيات والأدوات.',
        experience_years: 5,
        aspirations: 'أسعى لأن أكون رائداً في مجال تطوير الويب وأن أساهم في بناء حلول تقنية مبتكرة تخدم المجتمع.',
        profile_image_url: null,
        created_at: new Date(),
        updated_at: new Date()
      });

      setSkills(skillsData.length ? skillsData : [
        { id: 1, name: 'React', category: 'Frontend', proficiency_level: 5, icon_url: null, display_order: 1, created_at: new Date() },
        { id: 2, name: 'TypeScript', category: 'Language', proficiency_level: 4, icon_url: null, display_order: 2, created_at: new Date() },
        { id: 3, name: 'Node.js', category: 'Backend', proficiency_level: 4, icon_url: null, display_order: 3, created_at: new Date() },
        { id: 4, name: 'Next.js', category: 'Framework', proficiency_level: 5, icon_url: null, display_order: 4, created_at: new Date() },
        { id: 5, name: 'PostgreSQL', category: 'Database', proficiency_level: 3, icon_url: null, display_order: 5, created_at: new Date() },
        { id: 6, name: 'Docker', category: 'DevOps', proficiency_level: 3, icon_url: null, display_order: 6, created_at: new Date() }
      ]);

      setProjects(projectsData.length ? projectsData : [
        {
          id: 1,
          title: 'متجر إلكتروني متقدم',
          description: 'منصة تجارة إلكترونية شاملة تتضمن إدارة المنتجات، نظام الدفع، وإدارة الطلبات.',
          short_description: 'منصة تجارة إلكترونية متكاملة',
          technologies_used: '["React", "Node.js", "PostgreSQL", "Stripe"]',
          live_demo_url: null,
          github_url: null,
          image_url: null,
          display_order: 1,
          is_featured: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          title: 'نظام إدارة المحتوى',
          description: 'نظام CMS مخصص يتيح للمستخدمين إدارة المحتوى بسهولة مع واجهة مستخدم بديهية.',
          short_description: 'نظام إدارة محتوى مخصص',
          technologies_used: '["Next.js", "Prisma", "MySQL"]',
          live_demo_url: null,
          github_url: null,
          image_url: null,
          display_order: 2,
          is_featured: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          title: 'تطبيق إدارة المهام',
          description: 'تطبيق ويب لإدارة المهام والمشاريع مع إمكانيات التعاون الجماعي والتنبيهات.',
          short_description: 'تطبيق إدارة المهام التعاوني',
          technologies_used: '["Vue.js", "Express.js", "MongoDB"]',
          live_demo_url: null,
          github_url: null,
          image_url: null,
          display_order: 3,
          is_featured: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      setContactInfo(contactData || {
        id: 1,
        email: 'ahmed@example.com',
        phone: '+966 50 123 4567',
        location: 'الرياض، المملكة العربية السعودية',
        linkedin_url: 'https://linkedin.com/in/ahmed-dev',
        github_url: 'https://github.com/ahmed-dev',
        twitter_url: 'https://twitter.com/ahmed_dev',
        website_url: null,
        updated_at: new Date()
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await trpc.createContactMessage.mutate(contactForm);
      setSubmitMessage('تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.');
      setContactForm({
        name: '',
        email: '',
        subject: null,
        message: ''
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitMessage('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProficiencyText = (level: number): string => {
    switch (level) {
      case 5: return 'خبير';
      case 4: return 'متقدم';
      case 3: return 'متوسط';
      case 2: return 'مبتدئ متقدم';
      case 1: return 'مبتدئ';
      default: return 'غير محدد';
    }
  };

  const parseTechnologies = (techString: string): string[] => {
    try {
      return JSON.parse(techString);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {profile?.name || 'مطور ويب'}
            </h1>
            <div className="hidden md:flex space-x-reverse space-x-8">
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">نبذة عني</a>
              <a href="#skills" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">المهارات</a>
              <a href="#projects" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">المشاريع</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">تواصل معي</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-white shadow-xl">
                <AvatarImage src={profile?.profile_image_url || undefined} alt={profile?.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {profile?.name?.split(' ').map(n => n[0]).join('') || 'م'}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              مرحباً، أنا{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {profile?.name || 'أحمد'}
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed">
              {profile?.title || 'مطور ويب متخصص'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3">
                تصفح أعمالي
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
                تحميل السيرة الذاتية
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">نبذة عني</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                {profile?.bio || 'مطور ويب شغوف بالتقنيات الحديثة...'}
              </p>
              {profile?.aspirations && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">طموحاتي</h3>
                  <p className="text-slate-700 leading-relaxed">{profile.aspirations}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">الخبرة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      {profile?.experience_years || 5}+
                    </div>
                    <p className="text-slate-600">سنوات من الخبرة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">المهارات التقنية</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill: Skill) => (
              <Card key={skill.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-slate-900">{skill.name}</CardTitle>
                      <CardDescription className="text-slate-600">{skill.category}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
                      {getProficiencyText(skill.proficiency_level)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">مستوى الإتقان</span>
                      <span className="text-slate-900 font-medium">{skill.proficiency_level}/5</span>
                    </div>
                    <Progress value={skill.proficiency_level * 20} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">معرض الأعمال</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-6">مجموعة من المشاريع التي عملت عليها</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project) => (
              <Card key={project.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-blue-300">🚀</div>
                    </div>
                  )}
                  {project.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      مميز
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 line-clamp-2">
                    {project.short_description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {parseTechnologies(project.technologies_used).map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-3">
                    {project.live_demo_url && (
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        عرض مباشر
                      </Button>
                    )}
                    {project.github_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        الكود المصدري
                      </Button>
                    )}
                    {!project.live_demo_url && !project.github_url && (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        قيد التطوير
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">تواصل معي</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-6">لا تتردد في الوصول إليّ لمناقشة مشروعك القادم</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">معلومات التواصل</h3>
              
              {contactInfo && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/70 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                      📧
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">البريد الإلكتروني</p>
                      <p className="text-slate-600">{contactInfo.email}</p>
                    </div>
                  </div>

                  {contactInfo.phone && (
                    <div className="flex items-center gap-4 p-4 bg-white/70 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xl">
                        📱
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">رقم الهاتف</p>
                        <p className="text-slate-600">{contactInfo.phone}</p>
                      </div>
                    </div>
                  )}

                  {contactInfo.location && (
                    <div className="flex items-center gap-4 p-4 bg-white/70 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-xl">
                        📍
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">الموقع</p>
                        <p className="text-slate-600">{contactInfo.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    {contactInfo.linkedin_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        LinkedIn
                      </Button>
                    )}
                    {contactInfo.github_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        GitHub
                      </Button>
                    )}
                    {contactInfo.twitter_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        Twitter
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">أرسل رسالة</CardTitle>
                <CardDescription>سأتواصل معك في أقرب وقت ممكن</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">الاسم</label>
                      <Input
                        required
                        value={contactForm.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateContactMessageInput) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="اسمك الكامل"
                        className="bg-white/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateContactMessageInput) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="email@example.com"
                        className="bg-white/80"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الموضوع (اختياري)</label>
                    <Input
                      value={contactForm.subject || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContactForm((prev: CreateContactMessageInput) => ({ ...prev, subject: e.target.value || null }))
                      }
                      placeholder="موضوع الرسالة"
                      className="bg-white/80"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الرسالة</label>
                    <Textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setContactForm((prev: CreateContactMessageInput) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="اكتب رسالتك هنا..."
                      className="bg-white/80 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </Button>
                  
                  {submitMessage && (
                    <div className={`p-4 rounded-lg text-sm ${
                      submitMessage.includes('بنجاح') 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-slate-400">
              © 2024 {profile?.name || 'مطور ويب'}. جميع الحقوق محفوظة.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              تم تطوير هذا الموقع باستخدام React و TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
