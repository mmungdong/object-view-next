import { Button } from "@/components/ui/button";

export default function TestShadcn() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ShadCN UI Test</h1>
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="gradient">Gradient Button</Button>
        <Button variant="success">Success Button</Button>
        <Button variant="warning">Warning Button</Button>
        <Button variant="info">Info Button</Button>
        <Button variant="dark">Dark Button</Button>
        <Button variant="pulse">Pulse Button</Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        <Button size="sm">Small Button</Button>
        <Button size="default">Default Size</Button>
        <Button size="lg">Large Button</Button>
        <Button size="circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </div>
  );
}