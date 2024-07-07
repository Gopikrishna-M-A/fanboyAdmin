"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const groups = [
  {
    // label: "Das",
    teams: [
      {
        label: "Business",
        value: "business",
      },
      {
        label: "Sales",
        value: "sales",
      },
      {
        label: "Reports",
        value: "reports",
      },
    ],
  },
//   {
//     label: "Teams",
//     teams: [
//       {
//         label: "Acme Inc.",
//         value: "acme-inc",
//       },
//       {
//         label: "Monsters Inc.",
//         value: "monsters",
//       },
//     ],
//   },
]

// type Team = (typeof groups)[number]["teams"][number]

// type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

// interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher( className ) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState(groups[0].teams[0])

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[150px] justify-between", className)}
          >
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandList>
              {/* <CommandInput placeholder="Search team..." /> */}
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group,index) => (
                <CommandGroup key={index} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team)
                        setOpen(false)
                      }}
                      className="text-sm"
                    >
                      
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            
          </Command>
        </PopoverContent>
      </Popover>
      
  )
}
