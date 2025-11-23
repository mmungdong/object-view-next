export default function TailwindDirectTest() {
  return (
    <div style={{ padding: '2rem', backgroundColor: 'blue', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Direct Style Test (No Tailwind)
      </h1>
      <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
        This uses direct styles instead of Tailwind classes to verify that the app can render correctly.
      </p>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'red', borderRadius: '0.5rem' }}>
        <p style={{ fontSize: '1.25rem' }}>This should have a red background and rounded corners</p>
      </div>
    </div>
  );
}