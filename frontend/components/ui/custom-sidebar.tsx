"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CustomButton } from "./custom-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share, Edit, Archive, Trash2, Sparkles, PanelLeftClose, PanelLeftOpen, MoreHorizontal } from "lucide-react"

export interface SidebarUser {
  firstName: string
  lastName: string
  email?: string
  avatar?: string
}

export interface SidebarItem {
  id: string
  title: string
  preview?: string
  timestamp?: string
  metadata?: Record<string, any>
  onClick?: () => void
}

export interface CustomSidebarProps {
  user: SidebarUser
  title: string
  items: SidebarItem[]
  onUserAction?: (action: string) => void
  onItemAction?: (itemId: string, action: string) => void
  className?: string
  width?: number
  collapsedWidth?: number
  defaultCollapsed?: boolean
}

const CustomSidebar = React.forwardRef<HTMLDivElement, CustomSidebarProps>(
  (
    {
      user,
      title,
      items,
      onUserAction,
      onItemAction,
      className,
      width = 320,
      collapsedWidth = 80,
      defaultCollapsed = false,
    },
    ref,
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

    const handleItemAction = (itemId: string, action: string) => {
      onItemAction?.(itemId, action)
    }

    const handleUserAction = (action: string) => {
      onUserAction?.(action)
    }

    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed)
    }

    const currentWidth = isCollapsed ? collapsedWidth : width

    return (
      <div
        ref={ref}
        className={cn("bg-brand-300 text-white flex flex-col transition-all duration-300 ease-in-out", className)}
        style={{ width: currentWidth }}
      >
        {/* Logo Header - Always centered */}
        <div className="p-4 border-b border-brand-200 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
              <div className="rounded-full border-2 border-[#819A91] p-1 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 w-10 object-contain rounded-full"
                  style={{ transform: "scale(1.8)" }}
                />
              </div>
            </div>

          {/* Title and Toggle - only show when expanded */}
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-medium text-brand-50 transition-opacity duration-200">{title}</h2>

              {/* Modern Toggle Button */}
              <CustomButton
                variant="ghost"
                size="icon-sm"
                onClick={toggleSidebar}
                className="text-brand-50 hover:text-white hover:bg-brand-400 transition-colors hover:scale-180"
              >
                <PanelLeftClose className="h-20 w-20 transition-transform duration-200" />
              </CustomButton>
            </div>
          )}

          {/* Modern Toggle Button for collapsed state */}
          {isCollapsed && (
            <CustomButton
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              className="text-brand-50 hover:text-white hover:bg-brand-400 transition-colors hover:scale-180"
            >
              <PanelLeftOpen className="h-20 w-20 transition-transform duration-200" />
            </CustomButton>
          )}
        </div>

        {/* Chat Items List */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {items.length > 0
              ? items.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-brand-400 cursor-pointer transition-colors"
                    onClick={item.onClick}
                    title={isCollapsed ? item.title : undefined}
                  >
                    {isCollapsed ? (
                      // Collapsed view - show only icon
                      <div className="w-full flex justify-center">
                        <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-brand-300">
                            {item.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Expanded view - show full content
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate font-medium">{item.title}</p>
                        </div>

                        {/* Context Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <CustomButton
                              variant="ghost"
                              size="icon-sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-brand-50 hover:text-white hover:bg-brand-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </CustomButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-brand-400 border-brand-200">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleItemAction(item.id, "share")
                              }}
                              className="text-white hover:bg-brand-200 focus:bg-brand-200"
                            >
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleItemAction(item.id, "rename")
                              }}
                              className="text-white hover:bg-brand-200 focus:bg-brand-200"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleItemAction(item.id, "archive")
                              }}
                              className="text-white hover:bg-brand-200 focus:bg-brand-200"
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleItemAction(item.id, "delete")
                              }}
                              className="text-red-300 hover:bg-brand-200 focus:bg-brand-200 hover:text-red-200"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))
              : !isCollapsed && (
                  <div className="text-center py-8">
                    <p className="text-brand-100 text-sm">No {title.toLowerCase()} yet</p>
                    <p className="text-brand-100 text-xs mt-1">Start by creating your first one</p>
                  </div>
                )}
          </div>
        </ScrollArea>

      <div className="p-4 border-t border-brand-200">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {isCollapsed ? (
        // Collapsed profile - clickable initial circle
        <CustomButton 
          variant="ghost" 
          size="icon-sm"
          className="w-full flex justify-center hover:bg-brand-400"
        >
          <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-brand-300">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
        </CustomButton>
      ) : (
        // Expanded profile - full clickable area
        <CustomButton variant="ghost" className="w-full justify-start p-2 hover:bg-brand-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-100 to-brand-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-brand-300">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {user?.firstName || 'User'}
              </p>
              <p className="text-xs text-brand-50">Study Together, Succeed Faster.</p>
            </div>
          </div>
        </CustomButton>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent side="top" className="w-48 bg-brand-400 border-brand-200">
      <DropdownMenuItem
        onClick={() => handleUserAction("profile")}
        className="text-white hover:bg-brand-200 focus:bg-brand-200"
      >
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleUserAction("settings")}
        className="text-white hover:bg-brand-200 focus:bg-brand-200"
      >
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleUserAction("help")}
        className="text-white hover:bg-brand-200 focus:bg-brand-200"
      >
        Help & Support
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleUserAction("logout")}
        className="text-white hover:bg-brand-200 focus:bg-brand-200"
      >
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
      </div>
    )
  },
)
CustomSidebar.displayName = "CustomSidebar"

export { CustomSidebar }