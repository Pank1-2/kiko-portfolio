import type { Project } from "../data";

export function StudyMeta({
  project,
  teamLabel = "Team size",
}: {
  project: Project;
  teamLabel?: string;
}) {
  const fields = [
    { label: "Role", value: project.roleHeadline, detail: project.roleDetail },
    { label: "Duration", value: project.timeline, detail: project.timelineDetail },
    { label: teamLabel, value: project.teamHeadline, detail: project.teamDetail },
    { label: "Tools", value: project.tools },
  ];

  return (
    <dl className="study-facts">
      {fields.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            <strong>{item.value}</strong>
            {item.detail ? <p>{item.detail}</p> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
