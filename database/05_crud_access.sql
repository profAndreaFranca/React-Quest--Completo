-- Aula 19: aplicar uma vez após conferir as políticas existentes.
-- As políticas de leitura demonstrativa da Aula 18 devem permanecer.

ALTER TABLE public.projects
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.missions
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.projects,
  public.missions
FROM anon, authenticated;

GRANT USAGE ON SCHEMA public
TO anon, authenticated;

GRANT SELECT ON TABLE
  public.projects,
  public.missions
TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE
  public.projects,
  public.missions
TO authenticated;

ALTER TABLE public.projects
ALTER COLUMN user_id
SET DEFAULT auth.uid();

ALTER TABLE public.missions
ALTER COLUMN user_id
SET DEFAULT auth.uid();

CREATE POLICY "projects_select_own"
ON public.projects
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "projects_insert_own"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
);

CREATE POLICY "projects_update_own"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
)
WITH CHECK (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
);

CREATE POLICY "projects_delete_own"
ON public.projects
FOR DELETE
TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
);

CREATE POLICY "missions_select_own"
ON public.missions
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = user_id
);

CREATE POLICY "missions_insert_own"
ON public.missions
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
);

CREATE POLICY "missions_update_own"
ON public.missions
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
)
WITH CHECK (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
);

CREATE POLICY "missions_delete_own"
ON public.missions
FOR DELETE
TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  AND is_demo = false
);

-- Preparação opcional da conta de laboratório: substituir o placeholder
-- apenas no SQL Editor e executar uma única vez por usuário.
/*
INSERT INTO public.projects (
  user_id,
  title,
  description,
  technologies,
  status,
  github_url,
  deploy_url,
  is_demo
)
SELECT
  'UUID-DO-USUARIO-DE-TESTE'::uuid,
  title,
  description,
  technologies,
  status,
  github_url,
  deploy_url,
  false
FROM public.projects
WHERE is_demo = true
AND user_id IS NULL;

INSERT INTO public.missions (
  user_id,
  title,
  description,
  technology,
  difficulty,
  xp,
  completed,
  is_demo
)
SELECT
  'UUID-DO-USUARIO-DE-TESTE'::uuid,
  title,
  description,
  technology,
  difficulty,
  xp,
  completed,
  false
FROM public.missions
WHERE is_demo = true
AND user_id IS NULL;
*/

