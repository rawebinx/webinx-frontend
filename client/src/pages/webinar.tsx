import { useQuery } from "@tanstack/react-query";

type Webinar = {
  id: string;
  title: string;
  slug: string;
  start_time: string;
  click_count: number;
};

export default function WebinarPage({ params }: any) {

  const slug = params.slug;

  const { data, isLoading } = useQuery<Webinar>({
    queryKey: ["webinar", slug],
    queryFn: async () => {
      const res = await fetch(
        `https://webinx-backend.onrender.com/api/events/${slug}`
      );

      if (!res.ok) throw new Error("Failed");

      return res.json();
    }
  });

  if (isLoading) {
    return <div style={{ padding: "40px" }}>Loading webinar...</div>;
  }

  if (!data) {
    return <div style={{ padding: "40px" }}>Webinar not found</div>;
  }

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>

      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        {data.title}
      </h1>

      <p style={{ marginTop: "10px" }}>
        Date: {new Date(data.start_time).toLocaleString()}
      </p>

      <p style={{ marginTop: "10px" }}>
        Popularity score: {data.click_count}
      </p>

      <a
        href="#"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none"
        }}
      >
        Register for Webinar
      </a>

    </main>
  );
}
