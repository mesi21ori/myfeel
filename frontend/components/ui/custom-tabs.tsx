"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CustomButton } from "./custom-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const tabsVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      pills: "space-x-1",
      underline: "border-b",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const tabsListVariants = cva("inline-flex items-center justify-center rounded-md p-1", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      pills: "bg-transparent space-x-1",
      underline: "bg-transparent border-b w-full justify-start p-0",
    },
    size: {
      default: "h-10",
      sm: "h-9",
      lg: "h-11",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills: "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        underline:
          "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface TabItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  content?: React.ReactNode
  disabled?: boolean
  dropdown?: {
    items: Array<{
      id: string
      label: string
      icon?: React.ComponentType<{ className?: string }>
      onClick?: () => void
    }>
  }
}

export interface CustomTabsProps extends VariantProps<typeof tabsVariants> {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  size?: "default" | "sm" | "lg"
}

const CustomTabs = React.forwardRef<HTMLDivElement, CustomTabsProps>(
  ({ tabs, defaultValue, value, onValueChange, variant, size, className }, ref) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.id || "")

    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value)
      }
    }, [value])

    const handleTabChange = (tabId: string) => {
      if (value === undefined) {
        setActiveTab(tabId)
      }
      onValueChange?.(tabId)
    }

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
      <div ref={ref} className={cn(tabsVariants({ variant }), className)}>
        {/* Tabs List */}
        <div className={cn(tabsListVariants({ variant, size }))}>
          {tabs.map((tab) => {
            if (tab.dropdown) {
              return (
                <DropdownMenu key={tab.id}>
                  <DropdownMenuTrigger asChild>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      className={cn(
                        tabsTriggerVariants({ variant }),
                        activeTab === tab.id && "bg-background text-foreground shadow-sm",
                        "gap-2",
                      )}
                      disabled={tab.disabled}
                    >
                      {tab.icon && <tab.icon className="h-4 w-4" />}
                      {tab.label}
                      <ChevronDown className="h-3 w-3" />
                    </CustomButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    {tab.dropdown.items.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => {
                          handleTabChange(tab.id)
                          item.onClick?.()
                        }}
                        className="flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <CustomButton
                key={tab.id}
                variant="ghost"
                size="sm"
                className={cn(
                  tabsTriggerVariants({ variant }),
                  activeTab === tab.id && "bg-background text-foreground shadow-sm",
                  "gap-2",
                )}
                onClick={() => handleTabChange(tab.id)}
                disabled={tab.disabled}
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
              </CustomButton>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTabContent && <div className="mt-6">{activeTabContent}</div>}
      </div>
    )
  },
)
CustomTabs.displayName = "CustomTabs"

export { CustomTabs }
