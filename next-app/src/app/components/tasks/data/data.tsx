import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const statuses = [
  {
    value: "in progress",
    label: "in progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "done",
    icon: CheckCircledIcon,
  },
  {
    value: "failed",
    label: "failed",
    icon: CrossCircledIcon,
  },
];
