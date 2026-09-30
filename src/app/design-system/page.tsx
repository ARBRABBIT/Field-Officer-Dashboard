"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CloudUpload,
  Download,
  Eye,
  Filter,
  LandPlot,
  Leaf,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CheckboxField,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Divider,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FileUpload,
  FormField,
  IconButton,
  Input,
  NavigationItem,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioItem,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";

const sections = [
  ["foundations", "Foundations"],
  ["actions", "Actions"],
  ["forms", "Forms"],
  ["data", "Data display"],
  ["navigation", "Navigation"],
  ["feedback", "Feedback"],
  ["overlays", "Overlays"],
] as const;

const swatches = [
  ["Operational blue", "#2780C4", "bg-accent"],
  ["Field lime", "#BDD327", "bg-[#bdd327]"],
  ["Canvas", "#F2F2F2", "bg-background"],
  ["Ink", "#1A1C1D", "bg-text"],
  ["Success", "#00801F", "bg-success"],
  ["Warning", "#D97706", "bg-warning"],
  ["Danger", "#C91C20", "bg-danger"],
] as const;

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8 grid gap-2 lg:grid-cols-[11rem_1fr] lg:items-start">
      <p className="text-label pt-1 uppercase tracking-[0.18em] text-text-muted">{eyebrow}</p>
      <div className="max-w-2xl">
        <h2 className="text-title text-text">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      </div>
    </div>
  );
}

function Specimen({ title, note, children, className }: { title: string; note?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card variant="bordered" padding="none" className={className}>
      <div className="border-b px-5 py-4">
        <p className="text-sm font-semibold">{title}</p>
        {note && <p className="mt-1 text-xs text-text-muted">{note}</p>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </Card>
  );
}

export default function DesignSystemPage() {
  const [toastOpen, setToastOpen] = React.useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <ToastProvider swipeDirection="right">
        <div className="min-h-screen bg-background">
          <header className="relative overflow-hidden border-b bg-surface">
            <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-accent lg:block" />
            <div className="absolute right-[38%] bottom-0 hidden h-full w-24 -skew-x-6 translate-x-12 bg-[#bdd327] lg:block" />
            <div className="relative mx-auto grid min-h-[25rem] max-w-[1440px] content-between px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-accent text-text-inverse shadow-low"><Leaf className="size-5" /></div>
                  <div><p className="text-sm font-bold tracking-tight">GREEN LAND CAPITAL</p><p className="text-caption text-text-muted">Product language / v1.0</p></div>
                </div>
                <Badge variant="outline" className="hidden bg-surface/90 sm:inline-flex">Figma audited · Production ready</Badge>
              </div>
              <div className="max-w-2xl py-14 lg:py-18">
                <p className="text-label mb-5 uppercase tracking-[0.22em] text-accent">Foundations → Components → Rules</p>
                <h1 className="max-w-xl text-[clamp(2.75rem,7vw,5.75rem)] font-bold leading-[0.92] tracking-[-0.055em] text-text">The GLC field manual.</h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary">A reusable interface language for land operations—from field verification and regional review to campaign, support, and administration workflows.</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-medium text-text-muted">
                <span>Plus Jakarta Sans</span><span>4px rhythm</span><span>44px controls</span><span>WCAG-ready focus</span>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="border-r bg-surface px-5 py-8 lg:sticky lg:top-0 lg:h-screen lg:px-6">
              <p className="text-label mb-4 uppercase tracking-[0.18em] text-text-muted">Contents</p>
              <nav className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1" aria-label="Design system sections">
                {sections.map(([href, label]) => <a key={href} href={`#${href}`} className="glc-focus rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text">{label}</a>)}
              </nav>
              <div className="mt-8 hidden rounded-2xl bg-accent p-5 text-text-inverse lg:block">
                <ShieldCheck className="size-5" />
                <p className="mt-8 text-sm font-semibold">System rule</p>
                <p className="mt-1 text-xs leading-5 text-white/70">Use Operational Blue for primary actions across every product role. Status colors only communicate meaning.</p>
              </div>
            </aside>

            <main className="min-w-0 px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
              <section id="foundations" className="scroll-mt-8">
                <SectionHeading eyebrow="01 / Foundations" title="A quiet canvas with two working accents" description="The shared system resolves Figma’s role-specific variations into one neutral base, one agricultural brand accent, and one operational accent." />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {swatches.map(([name, value, color]) => <div key={name} className="overflow-hidden rounded-2xl border bg-surface"><div className={`h-24 ${color}`} /><div className="flex items-center justify-between gap-3 p-4"><span className="text-sm font-semibold">{name}</span><code className="text-xs text-text-muted">{value}</code></div></div>)}
                </div>
                <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
                  <Specimen title="Typography" note="One family, six repeatable roles">
                    <div className="divide-y">
                      <div className="grid gap-3 py-5 sm:grid-cols-[8rem_1fr]"><span className="text-label text-text-muted">Display / 40</span><span className="text-display">Land intelligence</span></div>
                      <div className="grid gap-3 py-5 sm:grid-cols-[8rem_1fr]"><span className="text-label text-text-muted">Title / 24</span><span className="text-title">Assigned farmlands</span></div>
                      <div className="grid gap-3 py-5 sm:grid-cols-[8rem_1fr]"><span className="text-label text-text-muted">Heading / 18</span><span className="text-heading">Verification summary</span></div>
                      <div className="grid gap-3 py-5 sm:grid-cols-[8rem_1fr]"><span className="text-label text-text-muted">Body / 14</span><span className="text-body">Review the latest ownership and boundary records.</span></div>
                    </div>
                  </Specimen>
                  <Specimen title="Geometry" note="Normalized from repeated product values">
                    <div className="grid gap-6">
                      <div><p className="text-label mb-3 text-text-muted">Radius</p><div className="flex items-end gap-3">{[["8","rounded-lg"],["12","rounded-xl"],["16","rounded-2xl"],["24","rounded-3xl"],["Full","rounded-full"]].map(([label,r])=><div key={label} className="text-center"><div className={`size-12 border-2 border-accent bg-accent-soft ${r}`} /><p className="mt-2 text-caption text-text-muted">{label}</p></div>)}</div></div>
                      <div><p className="text-label mb-3 text-text-muted">Elevation</p><div className="grid grid-cols-3 gap-3"><div className="h-16 rounded-xl border bg-surface" /><div className="h-16 rounded-xl bg-surface shadow-low" /><div className="h-16 rounded-xl bg-surface shadow-medium" /></div></div>
                    </div>
                  </Specimen>
                </div>
              </section>

              <Divider className="my-16" />

              <section id="actions" className="scroll-mt-8">
                <SectionHeading eyebrow="02 / Actions" title="One action shape, clear levels of intent" description="Pill geometry is consistent across product roles. Color carries context; size and state remain predictable." />
                <div className="grid gap-6 xl:grid-cols-2">
                  <Specimen title="Button hierarchy" note="Default, hover, focus, pressed, disabled, and loading are built in">
                    <div className="flex flex-wrap gap-3"><Button>Approve record</Button><Button variant="accent">Verify now</Button><Button variant="secondary">Save draft</Button><Button variant="outline">View details</Button><Button variant="ghost">Dismiss</Button><Button variant="destructive">Delete</Button></div>
                    <div className="mt-5 flex flex-wrap items-center gap-3"><Button size="sm">Small</Button><Button size="md" loading>Checking</Button><Button size="lg">Continue <ArrowRight className="size-4" /></Button><Button disabled>Unavailable</Button></div>
                  </Specimen>
                  <Specimen title="Icon actions" note="Every icon-only action requires an accessible label">
                    <div className="flex flex-wrap items-center gap-3"><IconButton icon={Search} label="Search" variant="secondary" /><IconButton icon={Bell} label="Notifications" variant="secondary" /><IconButton icon={Filter} label="Filter results" variant="accent" /><IconButton icon={Plus} label="Add item" /><Tooltip><TooltipTrigger asChild><IconButton icon={MoreHorizontal} label="More actions" variant="ghost" /></TooltipTrigger><TooltipContent>More actions</TooltipContent></Tooltip></div>
                  </Specimen>
                </div>
              </section>

              <Divider className="my-16" />

              <section id="forms" className="scroll-mt-8">
                <SectionHeading eyebrow="03 / Forms" title="Controls for long operational workflows" description="Inputs stay compact and readable across verification, campaign, profile, and maintenance tasks." />
                <div className="grid gap-6 xl:grid-cols-2">
                  <Specimen title="Text entry" note="Labels and messages live in FormField">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Farmland ID" required><Input defaultValue="GLCSOS-045" /></FormField>
                      <FormField label="Assigned officer"><Input leadingIcon={UserRound} placeholder="Search officer" /></FormField>
                      <FormField label="Location" error="Choose a supported mandal"><Input leadingIcon={MapPin} invalid defaultValue="Outside service area" /></FormField>
                      <FormField label="Search records" optional hint="Search by land, agent, or district"><SearchInput placeholder="Search…" /></FormField>
                      <FormField label="Review comments" className="sm:col-span-2"><Textarea placeholder="Add a clear note for the next reviewer…" /></FormField>
                    </div>
                  </Specimen>
                  <Specimen title="Selection" note="Accessible Radix behavior with GLC visual rules">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField label="Priority"><Select defaultValue="high"><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent><SelectItem value="high">High priority</SelectItem><SelectItem value="medium">Medium priority</SelectItem><SelectItem value="low">Low priority</SelectItem></SelectContent></Select></FormField>
                      <FormField label="Distance"><Select defaultValue="10"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">0–10 km</SelectItem><SelectItem value="25">10–25 km</SelectItem><SelectItem value="50">25–50 km</SelectItem></SelectContent></Select></FormField>
                      <div><p className="text-label mb-3 text-text-secondary">Connectivity</p><RadioGroup defaultValue="available"><label className="flex items-center gap-3 text-sm"><RadioItem value="available" />Available</label><label className="flex items-center gap-3 text-sm"><RadioItem value="unavailable" />Not available</label></RadioGroup></div>
                      <div className="grid content-start gap-4"><CheckboxField id="ownership" label="Ownership verified" defaultChecked /><CheckboxField id="boundary" label="Boundary evidence" description="Survey report attached" /><label className="flex items-center justify-between gap-4 text-sm"><span><span className="block font-medium">Notifications</span><span className="text-xs text-text-muted">Receive verification updates</span></span><Switch defaultChecked /></label></div>
                    </div>
                  </Specimen>
                  <Specimen title="File upload" note="Drop zone used by document and campaign media flows" className="xl:col-span-2"><FileUpload title="Drop survey evidence here" description="PDF, JPG, PNG, MP4 · up to 100 MB" multiple /></Specimen>
                </div>
              </section>

              <Divider className="my-16" />

              <section id="data" className="scroll-mt-8">
                <SectionHeading eyebrow="04 / Data display" title="Readable at dashboard density" description="Status, cards, progress, and tables share a compact rhythm without collapsing hierarchy." />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Card variant="bordered"><CardHeader><div><CardDescription>Total farmlands</CardDescription><CardTitle className="mt-2 text-3xl">11,766</CardTitle></div><LandPlot className="size-5 text-accent" /></CardHeader><Progress value={84} label="Cleared" /></Card>
                  <Card variant="selected"><CardHeader><div><CardDescription>Active review</CardDescription><CardTitle className="mt-2">GLCSOS-05</CardTitle></div><Badge variant="warning">High priority</Badge></CardHeader><CardFooter><Button fullWidth>Resume verification</Button></CardFooter></Card>
                  <Card variant="interactive"><CardHeader><div><CardDescription>Regional officer</CardDescription><CardTitle className="mt-2">Arjun Wadhwa</CardTitle></div><Avatar alt="Arjun Wadhwa" status="online" /></CardHeader><p className="text-sm text-text-muted">RO Document Audit · 75%</p></Card>
                  <Card variant="elevated"><CardHeader><div><CardDescription>Pending checks</CardDescription><CardTitle className="mt-2 text-3xl">18</CardTitle></div><AlertTriangle className="size-5 text-warning" /></CardHeader><p className="text-sm text-text-muted">Three require action today.</p></Card>
                </div>
                <Specimen title="Semantic status" note="Meaning remains stable across every role" className="mt-6"><div className="flex flex-wrap gap-3"><Badge>Draft</Badge><Badge variant="accent">Assigned</Badge><Badge variant="accent">In review</Badge><Badge variant="success" dot>Completed</Badge><Badge variant="warning" dot>Pending</Badge><Badge variant="danger" dot>Returned</Badge><Badge variant="info">Escalated</Badge><Badge variant="outline">Archived</Badge></div></Specimen>
                <Specimen title="Operational table" note="Semantic markup, selected rows, actions, and status" className="mt-6">
                  <Table><TableHeader><TableRow><TableHead>Farmland ID</TableHead><TableHead>Officer</TableHead><TableHead>Area</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{[["GLCSOS-01","Ram Varma","120 acres","Completed","success"],["GLCSOS-04","Krishna R.","86 acres","In review","accent"],["GLCSOS-12","Meera Joshi","45 acres","Returned","danger"]].map(([id,officer,area,status,variant],index)=><TableRow key={id} selected={index===1}><TableCell className="font-semibold">{id}</TableCell><TableCell><div className="flex items-center gap-2"><Avatar alt={officer} size="sm" />{officer}</div></TableCell><TableCell>{area}</TableCell><TableCell><Badge variant={variant as "success"|"accent"|"danger"}>{status}</Badge></TableCell><TableCell className="text-right"><IconButton icon={Eye} label={`View ${id}`} variant="ghost" size="sm" /></TableCell></TableRow>)}</TableBody></Table>
                </Specimen>
              </section>

              <Divider className="my-16" />

              <section id="navigation" className="scroll-mt-8">
                <SectionHeading eyebrow="05 / Navigation" title="Pills for modes, quiet links for location" description="Navigation distinguishes global position, local views, and record pagination." />
                <div className="grid gap-6 xl:grid-cols-2">
                  <Specimen title="Primary and local navigation"><div className="flex flex-wrap gap-2"><NavigationItem href="#" icon={LandPlot} active>Farmlands</NavigationItem><NavigationItem href="#" icon={CloudUpload}>Drafts</NavigationItem><NavigationItem href="#" icon={Settings2} count={3}>Requests</NavigationItem></div><div className="mt-6"><Tabs defaultValue="assigned"><TabsList><TabsTrigger value="assigned">Assigned</TabsTrigger><TabsTrigger value="progress">In progress</TabsTrigger><TabsTrigger value="complete">Completed</TabsTrigger></TabsList><TabsContent value="assigned"><p className="text-sm text-text-muted">Showing assigned farmland records.</p></TabsContent><TabsContent value="progress"><p className="text-sm text-text-muted">Showing in-progress records.</p></TabsContent><TabsContent value="complete"><p className="text-sm text-text-muted">Showing completed records.</p></TabsContent></Tabs></div></Specimen>
                  <Specimen title="Breadcrumb and pagination"><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Farmlands</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Assigned</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>GLCSOS-045</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb><div className="mt-8"><Pagination><PaginationList><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#" active>1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem><PaginationItem><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationList></Pagination></div></Specimen>
                </div>
              </section>

              <Divider className="my-16" />

              <section id="feedback" className="scroll-mt-8">
                <SectionHeading eyebrow="06 / Feedback" title="Feedback states explain what happens next" description="Soft backgrounds keep alerts legible without overpowering the workflow." />
                <div className="grid gap-4 lg:grid-cols-2"><Alert variant="success" title="Verification complete">Ownership and boundary records are ready for regional review.</Alert><Alert variant="info" title="New evidence available">A fresh satellite report was added five minutes ago.</Alert><Alert variant="warning" title="Action required">Two signatures are missing from the submitted deed.</Alert><Alert variant="danger" title="Upload failed">The video exceeds 100 MB. Compress it and upload again.</Alert></div>
                <div className="mt-6 grid gap-6 xl:grid-cols-2"><Specimen title="Loading"><div className="grid gap-5"><div className="flex items-center gap-3"><Spinner /><span className="text-sm text-text-muted">Checking land records…</span></div><Progress value={62} label="Document analysis" /><div className="grid grid-cols-[3rem_1fr] gap-3"><Skeleton className="size-12 rounded-full" /><div className="grid gap-2"><Skeleton className="h-4 w-2/5" /><Skeleton className="h-4 w-4/5" /></div></div></div></Specimen><Specimen title="Empty state"><EmptyState icon={LandPlot} title="No returned farmlands" description="Records sent back for correction will appear here." action={<Button variant="outline">View all records</Button>} /></Specimen></div>
              </section>

              <Divider className="my-16" />

              <section id="overlays" className="scroll-mt-8 pb-20">
                <SectionHeading eyebrow="07 / Overlays" title="Focused decisions without losing context" description="Dialog, menu, popover, tooltip, and toast primitives use managed focus and keyboard behavior." />
                <Specimen title="Interactive overlay specimens"><div className="flex flex-wrap gap-3">
                  <Dialog><DialogTrigger asChild><Button variant="destructive"><Trash2 className="size-4" />Delete farmland</Button></DialogTrigger><DialogContent className="max-w-md"><DialogHeader><div className="mb-4 grid size-12 place-items-center rounded-full bg-danger-soft text-danger"><Trash2 className="size-5" /></div><DialogTitle>Delete this farmland?</DialogTitle><DialogDescription>This removes GLCSOS-045 from the active review queue. This action cannot be undone.</DialogDescription></DialogHeader><DialogBody><Alert variant="danger">Any unsaved verification notes will also be removed.</Alert></DialogBody><DialogFooter><Button variant="secondary">Keep record</Button><Button variant="destructive">Delete farmland</Button></DialogFooter></DialogContent></Dialog>
                  <Popover><PopoverTrigger asChild><Button variant="secondary"><Filter className="size-4" />Quick filters</Button></PopoverTrigger><PopoverContent align="start"><p className="font-semibold">Filter records</p><p className="mt-1 text-xs text-text-muted">Choose the evidence types to include.</p><div className="mt-5 grid gap-4"><CheckboxField id="title-doc" label="Title documents" defaultChecked /><CheckboxField id="survey-doc" label="Survey reports" defaultChecked /><CheckboxField id="media-doc" label="Photos and video" /></div><Button variant="accent" fullWidth className="mt-5">Apply filters</Button></PopoverContent></Popover>
                  <DropdownMenu><DropdownMenuTrigger asChild><Button variant="secondary">Actions <ChevronDown className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuLabel>Record actions</DropdownMenuLabel><DropdownMenuItem><Eye className="size-4" />View details</DropdownMenuItem><DropdownMenuItem><Download className="size-4" />Export PDF</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuCheckboxItem checked>Notify officer</DropdownMenuCheckboxItem><DropdownMenuItem destructive><Trash2 className="size-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                  <Button variant="accent" onClick={() => setToastOpen(true)}><Check className="size-4" />Show toast</Button>
                </div></Specimen>
              </section>
            </main>
          </div>
        </div>
        <Toast open={toastOpen} onOpenChange={setToastOpen} status="success"><div><ToastTitle>Changes saved</ToastTitle><ToastDescription>Road connectivity was updated successfully.</ToastDescription></div></Toast><ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
