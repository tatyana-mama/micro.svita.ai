#!/usr/bin/env python3
"""Generate the Day-1 opening checklist PDF bonus for SVITA Micro.

Produces data/bonuses/day1-checklist.pdf — a printable 48-task pre-launch
checklist handed out free with every concept purchase.
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

INK = colors.HexColor("#0A0A0B")
ACCENT = colors.HexColor("#D6FF3E")
MUTED = colors.HexColor("#64748B")
LINE = colors.HexColor("#E2E8F0")
SOFT = colors.HexColor("#F8FAFC")

SECTIONS = [
    (
        "Legal & registration",
        [
            "Reserve legal entity name with local registry",
            "File incorporation paperwork (sole trader / LLC / sp. z o.o.)",
            "Open business bank account; set up card acquiring",
            "Register as VAT payer if thresholds require",
            "Obtain sanitary / HACCP approval (food categories)",
            "Secure commercial lease; verify zoning permits cover the activity",
            "Register employees with social insurance before day 1",
            "Buy third-party liability + property insurance",
        ],
    ),
    (
        "Location & fit-out",
        [
            "Finalise floor plan with electrical & plumbing markups",
            "Agree fit-out timeline with the contractor in writing",
            "Order long-lead equipment (6+ weeks) first",
            "Install point-of-sale hardware and test offline fallback",
            "Set up Wi-Fi with separate staff and guest networks",
            "Mount safety signage, fire extinguishers, first-aid kit",
            "Verify ventilation + noise compliance before opening",
            "Deep-clean the space 48 h before soft launch",
        ],
    ),
    (
        "Supply chain",
        [
            "Confirm three primary suppliers per critical SKU",
            "Lock in delivery windows and minimum orders in writing",
            "Agree payment terms (NET 14 target)",
            "Set par-stock levels for week 1 and week 2",
            "Put perishables on a first-in-first-out rotation plan",
            "Print supplier contact sheet; pin it in the back-of-house",
            "Schedule stock audits for day 7 and day 30",
            "Decide cash-float and petty-cash policy",
        ],
    ),
    (
        "Team & training",
        [
            "Hire core team 3 weeks before opening",
            "Run two rehearsal shifts with full menu / service flow",
            "Train everyone on POS, refunds, and cash handling",
            "Document open / close checklists and post them visibly",
            "Assign a shift lead for opening week",
            "Publish staff schedules two weeks ahead",
            "Brief team on emergency contacts and evacuation plan",
            "Agree dress code, hygiene and grooming standard",
        ],
    ),
    (
        "Brand & marketing",
        [
            "Register the business on Google Business Profile",
            "Claim handles on Instagram, TikTok, Facebook",
            "Publish a one-page website with address, hours, menu",
            "Commission launch photo shoot (hero + 10 product shots)",
            "Design opening-week flyer; print 500 copies",
            "Set up email capture at the counter",
            "Plan a soft-launch day with friends-and-family feedback",
            "Prepare press kit: one-pager, logo pack, photos",
        ],
    ),
    (
        "Opening day",
        [
            "Arrive 3 hours early; run full open checklist",
            "Verify every till, fridge, and machine is live",
            "Brief the team, assign stations, set the tone",
            "Place a last-minute sanity order for consumables",
            "Welcome first guests; capture photos and quotes",
            "Log every issue in a running day-1 journal",
            "Debrief the team at close; celebrate the small wins",
            "Schedule a 7-day retrospective and a 30-day review",
        ],
    ),
]


def build(out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(out),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
        title="SVITA Micro — Day-1 Opening Checklist",
        author="SVITA Micro",
    )

    base = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "title",
        parent=base["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=30,
        textColor=INK,
        spaceAfter=4,
    )
    tagline_style = ParagraphStyle(
        "tagline",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=MUTED,
        spaceAfter=14,
    )
    section_style = ParagraphStyle(
        "section",
        parent=base["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=INK,
        spaceBefore=10,
        spaceAfter=6,
    )
    task_style = ParagraphStyle(
        "task",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=INK,
    )
    foot_style = ParagraphStyle(
        "foot",
        parent=base["BodyText"],
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=12,
        textColor=MUTED,
        alignment=1,
        spaceBefore=14,
    )

    story = []
    story.append(Paragraph("Day-1 Opening Checklist", title_style))
    story.append(
        Paragraph(
            "48 pre-launch tasks — included free with every SVITA Micro concept. "
            "Print, pin it in the back of house, and tick items off as you go.",
            tagline_style,
        )
    )

    # Accent divider
    divider = Table([[""]], colWidths=[174 * mm], rowHeights=[2])
    divider.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ACCENT),
                ("LINEBELOW", (0, 0), (-1, -1), 0, colors.white),
            ]
        )
    )
    story.append(divider)
    story.append(Spacer(1, 8))

    for idx, (title, tasks) in enumerate(SECTIONS, start=1):
        story.append(
            Paragraph(f"{idx:02d} &nbsp;&nbsp; {title}", section_style)
        )
        rows = [
            [
                "☐",
                Paragraph(task, task_style),
            ]
            for task in tasks
        ]
        table = Table(rows, colWidths=[8 * mm, 166 * mm])
        table.setStyle(
            TableStyle(
                [
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (0, -1), 13),
                    ("TEXTCOLOR", (0, 0), (0, -1), INK),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                    ("LINEBELOW", (0, 0), (-1, -2), 0.4, LINE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        story.append(table)

    story.append(
        Paragraph(
            "SVITA Micro — micro.svita.ai &nbsp;·&nbsp; bonus for concept buyers &nbsp;·&nbsp; "
            "v1.0",
            foot_style,
        )
    )

    doc.build(story)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    build(project_root / "data" / "bonuses" / "day1-checklist.pdf")
