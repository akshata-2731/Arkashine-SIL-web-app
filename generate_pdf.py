import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

pdf_path = r"c:\Users\hp\Documents\antigravity\gallant-hubble\Arkashine_Site_Flow.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#143D30')
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13,
    textColor=colors.HexColor('#475569')
)

h1_style = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=colors.HexColor('#0F172A'),
    spaceBefore=10,
    spaceAfter=6
)

body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#334155')
)

bold_style = ParagraphStyle(
    'BoldCustom',
    parent=body_style,
    fontName='Helvetica-Bold',
    textColor=colors.HexColor('#0F172A')
)

th_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#0F172A')
)

badge_style = ParagraphStyle(
    'Badge',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#065F46')
)

elements = []

# Header
elements.append(Paragraph("Arkashine School Innovation Lab (SIL)", title_style))
elements.append(Paragraph("Summer Innovation Program (72 Training Hours) • Complete Site Flow & Architecture", subtitle_style))
elements.append(Spacer(1, 10))
elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#143D30'), spaceBefore=2, spaceAfter=12))

# Section 1: User Hierarchy & Role Flow
elements.append(Paragraph("1. Three-Level Operational Hierarchy & Navigation Flow", h1_style))
elements.append(Paragraph("The web application provides 5 distinct role-scoped views with zero dead-ends and max 2-click reachability:", body_style))
elements.append(Spacer(1, 6))

roles_data = [
    [
        Paragraph("Role & Scope", th_style),
        Paragraph("User Persona", th_style),
        Paragraph("Screens & Primary Flow", th_style)
    ],
    [
        Paragraph("<b>1. Arkashine HQ</b><br/><font color='#059669'>Super Admin</font>", body_style),
        Paragraph("Dr. Vivek Saxena<br/><font color='#64748B'>Managing Director</font>", body_style),
        Paragraph("<b>• Overview</b>: 4 KPI cards, school deployment hub, Needs Attention list.<br/>"
                  "<b>• Schools & Partners</b>: 18-point Eligibility gating (Eligible / Conditional / Rejected).<br/>"
                  "<b>• Program Heat Map</b>: 28-day compliance across all schools.<br/>"
                  "<b>• Impact & ESG</b>: Environmental (pH, OC, samples), Social (girls 52%), Governance.<br/>"
                  "<b>• Certificates</b>: Bulk validation and digital issuance.", body_style)
    ],
    [
        Paragraph("<b>2. Enabling Partner</b><br/><font color='#0284C7'>Implementation</font>", body_style),
        Paragraph("Dr. Sunita Deshmukh<br/><font color='#64748B'>GreenHorizon AgriEd</font>", body_style),
        Paragraph("<b>• Overview</b>: RAG health status cards for assigned schools.<br/>"
                  "<b>• My Schools & Lab Setup</b>: Sensor hardware & consumables tracking.<br/>"
                  "<b>• Student Selection</b>: 4-stage funnel (120 Registered → 60 Quiz → 30 Assignment → 18 Cohort).<br/>"
                  "<b>• Outreach & Support</b>: Support tickets directly to Arkashine HQ.", body_style)
    ],
    [
        Paragraph("<b>3. School Principal</b><br/><font color='#D97706'>School Head</font>", body_style),
        Paragraph("Fr. Thomas Matthew<br/><font color='#64748B'>St. Xavier's Senior Sec.</font>", body_style),
        Paragraph("<b>• My School</b>: 4-card scorecard (Hours, Attendance, Tests, Farmers) + 4-module progress.<br/>"
                  "<b>• Daily Log</b>: Chronological timeline of faculty updates with endorsement remarks.<br/>"
                  "<b>• Students & Risk</b>: Monitors students at-risk (&lt;80% attendance).<br/>"
                  "<b>• Certificates</b>: Principal verification and endorsement.", body_style)
    ],
    [
        Paragraph("<b>4. Faculty Coordinator</b><br/><font color='#0D9488'>Field Teacher</font>", body_style),
        Paragraph("Dr. Anjali Patil<br/><font color='#64748B'>Science Faculty</font>", body_style),
        Paragraph("<b>• Today's Update</b>: Quick-log engine (&lt;3 min, phone-optimized) with auto-saving draft.<br/>"
                  "<b>• Attendance</b>: 1-tap toggle (Present 🟢 → Late 🟡 → Absent 🔴).<br/>"
                  "<b>• Soil Lab (SoiLENZ)</b>: Logs tests (pH, EC, Organic Carbon, N, P, K).<br/>"
                  "<b>• Outreach</b>: Records farmer meetings and village campaigns.", body_style)
    ],
    [
        Paragraph("<b>5. Student Portal</b><br/><font color='#7C3AED'>Learner View</font>", body_style),
        Paragraph("Ananya Sharma<br/><font color='#64748B'>Class X-A, Group 1 Lead</font>", body_style),
        Paragraph("<b>• My Soil Journey</b>: 8-step precision soil workflow progression.<br/>"
                  "<b>• Modules & Quizzes</b>: Theory (Mod 1) & Practicals (Mod 2, 3, 4).<br/>"
                  "<b>• Badges</b>: Unlocks Sampler, Tester, Reporter, Farmer Friend.<br/>"
                  "<b>• Certificate</b>: Live preview with tamper-proof QR code verification.", body_style)
    ]
]

role_table = Table(roles_data, colWidths=[105, 115, 305])
role_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F8FAFC')),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(role_table)

elements.append(Spacer(1, 10))

# Section 2: 4 Curriculum Modules (Theory vs Practical)
elements.append(Paragraph("2. Curriculum Modules (Theory vs. Practical Breakdown)", h1_style))
elements.append(Paragraph("The 72-hour curriculum is structured so students master fundamental science and practical field techniques:", body_style))
elements.append(Spacer(1, 6))

module_data = [
    [
        Paragraph("Module", th_style),
        Paragraph("Type", th_style),
        Paragraph("Title & Hours", th_style),
        Paragraph("Key Focus & Hands-on Activities", th_style)
    ],
    [
        Paragraph("<b>Module 1</b>", body_style),
        Paragraph("<font color='#0284C7'><b>Theory 📖</b></font>", body_style),
        Paragraph("<b>Introduction to Agriculture & Soil Science</b><br/>18 Training Hours", body_style),
        Paragraph("Soil physics, chemistry (pH, EC, CEC), soil horizons (O, A, B, C), N-P-K nutrient cycles, and regenerative soil carbon dynamics. Assessment: Comprehensive Theory Quiz.", body_style)
    ],
    [
        Paragraph("<b>Module 2</b>", body_style),
        Paragraph("<font color='#059669'><b>Practical 🧪</b></font>", body_style),
        Paragraph("<b>Soil Sample Collection & Preparation</b><br/>18 Training Hours", body_style),
        Paragraph("Auger sampling at 0-15cm furrow depth, zig-zag traverses, GPS geotagging, composite quartering, shade drying, and 2mm sieving. Assessment: Quiz + Field Auger Assignment.", body_style)
    ],
    [
        Paragraph("<b>Module 3</b>", body_style),
        Paragraph("<font color='#059669'><b>Practical ⚡</b></font>", body_style),
        Paragraph("<b>Soil Testing using SoiLENZ Device</b><br/>18 Training Hours", body_style),
        Paragraph("Handheld SoiLENZ spectroscopic sensor operation, two-point buffer calibration (pH 4.0/7.0), quartz cuvette loading, and rapid 90-sec testing. Assessment: Quiz + SoiLENZ Challenge.", body_style)
    ],
    [
        Paragraph("<b>Module 4</b>", body_style),
        Paragraph("<font color='#059669'><b>Practical 🌾</b></font>", body_style),
        Paragraph("<b>Soil Health Reports & Farmer Advisory</b><br/>18 Training Hours", body_style),
        Paragraph("Generating Soil Health Cards, calculating customized fertilizer dosage, and student-led vernacular advisory meetings with village farmers. Assessment: Quiz + Capstone Project.", body_style)
    ]
]

mod_table = Table(module_data, colWidths=[60, 65, 155, 245])
mod_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F8FAFC')),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(mod_table)

elements.append(PageBreak())

# PAGE 2
elements.append(Paragraph("Arkashine School Innovation Lab (SIL)", title_style))
elements.append(Paragraph("Operational Workflows, Data Pipeline & Certification Gates • Page 2", subtitle_style))
elements.append(Spacer(1, 10))
elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#143D30'), spaceBefore=2, spaceAfter=12))

# Section 3: Student 8-Step Precision Lifecycle
elements.append(Paragraph("3. Student 8-Step Precision Soil Testing Lifecycle", h1_style))
elements.append(Paragraph("Students follow an 8-stage hands-on workflow from rural field sampling to farmer advisory:", body_style))
elements.append(Spacer(1, 6))

step_data = [
    [Paragraph("<b>Step 1: Collect</b><br/><font color='#64748B'>Auger core 0-15cm</font>", body_style),
     Paragraph("<b>Step 2: Prepare</b><br/><font color='#64748B'>Air dry & 2mm sieve</font>", body_style),
     Paragraph("<b>Step 3: Test</b><br/><font color='#64748B'>SoiLENZ 90s scan</font>", body_style),
     Paragraph("<b>Step 4: Record</b><br/><font color='#64748B'>Telemetry sync</font>", body_style)],
    [Paragraph("<b>Step 5: Analyze</b><br/><font color='#64748B'>N-P-K & OC balance</font>", body_style),
     Paragraph("<b>Step 6: Interpret</b><br/><font color='#64748B'>Soil Health Index</font>", body_style),
     Paragraph("<b>Step 7: Report</b><br/><font color='#64748B'>Print Health Card</font>", body_style),
     Paragraph("<b>Step 8: Apply</b><br/><font color='#64748B'>Farmer advisory</font>", body_style)]
]
step_table = Table(step_data, colWidths=[130, 130, 130, 135])
step_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
elements.append(step_table)

elements.append(Spacer(1, 12))

# Section 4: Faculty Daily Attendance Engine
elements.append(Paragraph("4. Faculty Coordinator Daily Attendance & Storing Engine", h1_style))
elements.append(Paragraph("Designed for quick phone-browser entry (&lt;3 minutes) by school teachers:", body_style))
elements.append(Spacer(1, 4))

daily_flow = [
    [Paragraph("<b>1. Session Format</b>", th_style), Paragraph("Select Module (1-4) and Session Type (Theory vs Practical). Stepper sets hours (2.5h default).", body_style)],
    [Paragraph("<b>2. 1-Tap Attendance</b>", th_style), Paragraph("Large student tap cards toggle: Present 🟢 → Late 🟡 → Absent 🔴 (or 'All Present' button). Drafts auto-save locally so data is never lost.", body_style)],
    [Paragraph("<b>3. Lab Telemetry</b>", th_style), Paragraph("Input count of SoiLENZ tests performed, farmers reached, and attach lab photo evidence.", body_style)],
    [Paragraph("<b>4. Submit & Store</b>", th_style), Paragraph("Permanently stored in local database. Instantly updates student hours, unlocks badges, and turns the school's calendar heat map green for Principal and Arkashine HQ.", body_style)]
]
df_table = Table(daily_flow, colWidths=[120, 405])
df_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F1F5F9')),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
elements.append(df_table)

elements.append(Spacer(1, 12))

# Section 5: Verification & Gating Architecture
elements.append(Paragraph("5. Strict Quality Gating & Certification Pipeline", h1_style))

gate_data = [
    [
        Paragraph("<b>Gate 1: School Eligibility Approval</b><br/>"
                  "• 18 verification points across Space, Infrastructure, Safety, Faculty, Students (80+ registrations), and signed MoU.<br/>"
                  "• Requires score ≥85% with 0 critical flags to move school from 'Pending' to 'Enrolled' status.", body_style)
    ],
    [
        Paragraph("<b>Gate 2: Soil Partner Certification Gate</b><br/>"
                  "• Strict prerequisites: 1) ≥80% student attendance (≥58 of 72 training hours), 2) Pass all 4 modules, 3) Complete SoiLENZ testing practical, 4) Complete farmer advisory.<br/>"
                  "• Generates official A4 Certificate with leaf guilloche border and tamper-proof verification QR code.", body_style)
    ]
]
gate_table = Table(gate_data, colWidths=[525])
gate_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0FDF4')),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#86EFAC')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(gate_table)

elements.append(Spacer(1, 12))

# Section 6: Live Theme Color Customizer
elements.append(Paragraph("6. Live Color Theme Customizer (For Demo Presentations)", h1_style))
elements.append(Paragraph(
    "A dedicated <b>Theme Colors 🎨</b> button in the top navigation bar allows 1-click theme switching during client meetings:<br/>"
    "• 🌲 <b>Forest Emerald</b> (Nature / Agritech) &nbsp;&nbsp;• 🌊 <b>Deep Navy & Sky</b> (Corporate Ed-Tech) &nbsp;&nbsp;• 🌾 <b>Warm Earth & Amber</b> (Soil & Farming)<br/>"
    "• 💎 <b>Modern Ocean Teal</b> (Sustainability) &nbsp;&nbsp;• 🔮 <b>Royal Purple</b> (Science & Innovation) &nbsp;&nbsp;• 🖤 <b>Minimal Slate</b> (Clean Monochrome)<br/>"
    "Clicking 'Fine Tune' opens custom color pickers for instant real-time live preview.",
    body_style
))

elements.append(Spacer(1, 14))
elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceBefore=2, spaceAfter=6))
elements.append(Paragraph(
    "<font color='#94A3B8'>Arkashine Innovations Pvt. Ltd. • School Innovation Lab Documentation • Generated October 2026</font>",
    ParagraphStyle('Foot', parent=body_style, alignment=1)
))

doc.build(elements)
print("PDF generated successfully at:", pdf_path)
