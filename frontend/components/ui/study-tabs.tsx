"use client"

import * as React from "react"
import { CustomTabs, type TabItem } from "./custom-tabs"
import { FileText, MessageSquare, LinkIcon, CheckCircle, Edit3, List, HelpCircle } from "lucide-react"

export interface StudyTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  uploadedFiles?: any[]
  isProcessing?: boolean
  className?: string
}

const StudyTabs = React.forwardRef<HTMLDivElement, StudyTabsProps>(
  ({ activeTab = "shortnote", onTabChange, uploadedFiles = [], isProcessing = false, className }, ref) => {
    const questionTypes = [
      { id: "true-false", label: "True/False", icon: CheckCircle },
      { id: "short-answer", label: "Short Answer", icon: Edit3 },
      { id: "choose", label: "Multiple Choice", icon: List },
      { id: "fill-blank", label: "Fill the Blank", icon: HelpCircle },
    ]

    const tabs: TabItem[] = [
      {
        id: "shortnote",
        label: "Short Note",
        icon: FileText,
        // Remove content - only show tabs
      },
      {
        id: "question",
        label: "Question",
        icon: MessageSquare,
        dropdown: {
          items: questionTypes.map((type) => ({
            id: type.id,
            label: type.label,
            icon: type.icon,
            onClick: () => onTabChange?.("question"),
          })),
        },
        // Remove content - only show tabs
      },
      {
        id: "reference",
        label: "Reference Links",
        icon: LinkIcon,
        // Remove content - only show tabs
      },
    ]

    return (
      <div ref={ref} className={className}>
        <CustomTabs tabs={tabs} value={activeTab} onValueChange={onTabChange} className="w-full" />
      </div>
    )
  },
)
StudyTabs.displayName = "StudyTabs"

export { StudyTabs }
