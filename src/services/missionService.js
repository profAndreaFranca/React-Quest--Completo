import { supabase } from "./supabaseClient";

export function fromMissionRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    technology: row.technology,
    difficulty: row.difficulty,
    xp: row.xp,
    completed: row.completed,
  };
}

function toMissionPayload(mission) {
  const title = mission.title.trim();

  const description =
    mission.description.trim();

  const xp = Number(mission.xp);

  if (!title || !description) {
    throw new Error(
      "Preencha o título e a descrição."
    );
  }

  if (!Number.isInteger(xp) || xp < 0) {
    throw new Error(
      "Informe uma pontuação válida."
    );
  }

  return {
    title,
    description,
    technology: mission.technology,
    difficulty: mission.difficulty,
    xp,
    completed: mission.completed,
  };
}

export async function createMission(mission) {
  const { data, error } = await supabase
    .from("missions")
    .insert(toMissionPayload(mission))
    .select()
    .single();

  if (error) throw error;

  return fromMissionRow(data);
}

export async function saveMission(mission) {
  const { data, error } = await supabase
    .from("missions")
    .update(toMissionPayload(mission))
    .eq("id", mission.id)
    .select()
    .single();

  if (error) throw error;

  return fromMissionRow(data);
}

export async function removeMission(missionId) {
  const { data, error } = await supabase
    .from("missions")
    .delete()
    .eq("id", missionId)
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
}

export async function setMissionCompleted(
  missionId,
  completed
) {
  const { data, error } = await supabase
    .from("missions")
    .update({ completed })
    .eq("id", missionId)
    .select()
    .single();

  if (error) throw error;

  return fromMissionRow(data);
}

