import { Button } from "@/components/ui/button";

export default function TestShadcn() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ShadCN UI Test</h1>
      <div className="space-x-4">
        <Button variant="default">Default Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Destructive Button</Button>
      </div>
    </div>
  );
}