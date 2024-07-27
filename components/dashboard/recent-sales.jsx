import {
  Avatar,
  AvatarFallback,
} from "../ui/avatar";

export function RecentSales({ recentSales }) {


  const formattedPrice = (price) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
    return formatted
  }

  return (
    <div className="space-y-8">
      {recentSales?.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(sale?.customer?.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer?.name}</p>
            <p className="text-sm text-muted-foreground">{sale.customer?.email}</p>
          </div>
          <div className="ml-auto font-medium">+ {formattedPrice(sale?.total?.toFixed(2))}</div>
        </div>
      ))}
    </div>
  );
}

function getInitials(name) {
  return name?.split(' ').map(word => word?.charAt(0))?.join('');
}
