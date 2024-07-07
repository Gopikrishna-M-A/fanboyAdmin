import Link from "next/link";
import { usePathname } from 'next/navigation'


const BusinessNavOptions = () => {
  const pathname = usePathname()
  const path = pathname.split('/')[1]
  
  return (
    <div className="flex items-center space-x-4 lg:space-x-6 ml-6">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          path ? 'text-muted-foreground' : ''}`}
      >
        Dashboard
      </Link>

      <Link
        href="/inventory"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          path != "inventory" ? 'text-muted-foreground' : ''}`}
      >
        Inventory
      </Link>

      <Link
        href="/sales"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          path != "sales" ? 'text-muted-foreground' : ''}`}
      >
        Sales
      </Link>

      {/* <Link
        href="/purchases"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          path != "purchases" ? 'text-muted-foreground' : ''}`}
      >
        Purchases
      </Link> */}

    </div>
  );
};

export default BusinessNavOptions;
