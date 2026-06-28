


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."increment_profile_views"("profile_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  update profiles set views = views + 1 where id = profile_id;
end;
$$;


ALTER FUNCTION "public"."increment_profile_views"("profile_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."applications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "job_id" "uuid",
    "applicant_id" "uuid",
    "message" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "applications_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'viewed'::"text", 'accepted'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cities" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."cities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clinics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "owner_id" "uuid",
    "name" "text" NOT NULL,
    "city_id" "uuid",
    "logo_url" "text",
    "description" "text",
    "phone" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."clinics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_posts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "clinic_id" "uuid",
    "title" "text" NOT NULL,
    "specialty_id" "uuid",
    "city_id" "uuid",
    "contract_type" "text",
    "schedule" "text",
    "experience_min_years" integer DEFAULT 0,
    "description" "text",
    "is_urgent" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "job_posts_contract_type_check" CHECK (("contract_type" = ANY (ARRAY['Temps plein'::"text", 'Temps partiel'::"text", 'Vacation'::"text", 'Week-end'::"text"]))),
    CONSTRAINT "job_posts_schedule_check" CHECK (("schedule" = ANY (ARRAY['Jour'::"text", 'Nuit'::"text", 'Après-midi'::"text"])))
);


ALTER TABLE "public"."job_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "phone" "text",
    "bio" "text",
    "specialty_id" "uuid",
    "city_id" "uuid",
    "experience_years" integer,
    "avatar_url" "text",
    "cv_url" "text",
    "is_available" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "views" integer DEFAULT 0
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."specialties" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."specialties" OWNER TO "postgres";


ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_job_id_applicant_id_key" UNIQUE ("job_id", "applicant_id");



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clinics"
    ADD CONSTRAINT "clinics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_posts"
    ADD CONSTRAINT "job_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."specialties"
    ADD CONSTRAINT "specialties_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."specialties"
    ADD CONSTRAINT "specialties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."job_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."clinics"
    ADD CONSTRAINT "clinics_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."clinics"
    ADD CONSTRAINT "clinics_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."job_posts"
    ADD CONSTRAINT "job_posts_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."job_posts"
    ADD CONSTRAINT "job_posts_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_posts"
    ADD CONSTRAINT "job_posts_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id");



CREATE POLICY "applicant can apply" ON "public"."applications" FOR INSERT WITH CHECK (("auth"."uid"() = "applicant_id"));



CREATE POLICY "applicant can see own applications" ON "public"."applications" FOR SELECT USING (("auth"."uid"() = "applicant_id"));



ALTER TABLE "public"."applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cities" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "clinic can insert own job posts" ON "public"."job_posts" FOR INSERT WITH CHECK (("clinic_id" IN ( SELECT "clinics"."id"
   FROM "public"."clinics"
  WHERE ("clinics"."owner_id" = "auth"."uid"()))));



CREATE POLICY "clinic can see applications to their jobs" ON "public"."applications" FOR SELECT USING (("job_id" IN ( SELECT "jp"."id"
   FROM ("public"."job_posts" "jp"
     JOIN "public"."clinics" "c" ON (("c"."id" = "jp"."clinic_id")))
  WHERE ("c"."owner_id" = "auth"."uid"()))));



CREATE POLICY "clinic can update application status" ON "public"."applications" FOR UPDATE USING (("job_id" IN ( SELECT "jp"."id"
   FROM ("public"."job_posts" "jp"
     JOIN "public"."clinics" "c" ON (("c"."id" = "jp"."clinic_id")))
  WHERE ("c"."owner_id" = "auth"."uid"()))));



CREATE POLICY "clinic can update own job posts" ON "public"."job_posts" FOR UPDATE USING (("clinic_id" IN ( SELECT "clinics"."id"
   FROM "public"."clinics"
  WHERE ("clinics"."owner_id" = "auth"."uid"()))));



ALTER TABLE "public"."clinics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "owner can insert clinic" ON "public"."clinics" FOR INSERT WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "owner can update clinic" ON "public"."clinics" FOR UPDATE USING (("auth"."uid"() = "owner_id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public read cities" ON "public"."cities" FOR SELECT USING (true);



CREATE POLICY "public read clinics" ON "public"."clinics" FOR SELECT USING (true);



CREATE POLICY "public read job posts" ON "public"."job_posts" FOR SELECT USING (true);



CREATE POLICY "public read profiles" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "public read specialties" ON "public"."specialties" FOR SELECT USING (true);



ALTER TABLE "public"."specialties" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "user can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."increment_profile_views"("profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_profile_views"("profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_profile_views"("profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."applications" TO "anon";
GRANT ALL ON TABLE "public"."applications" TO "authenticated";
GRANT ALL ON TABLE "public"."applications" TO "service_role";



GRANT ALL ON TABLE "public"."cities" TO "anon";
GRANT ALL ON TABLE "public"."cities" TO "authenticated";
GRANT ALL ON TABLE "public"."cities" TO "service_role";



GRANT ALL ON TABLE "public"."clinics" TO "anon";
GRANT ALL ON TABLE "public"."clinics" TO "authenticated";
GRANT ALL ON TABLE "public"."clinics" TO "service_role";



GRANT ALL ON TABLE "public"."job_posts" TO "anon";
GRANT ALL ON TABLE "public"."job_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."job_posts" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."specialties" TO "anon";
GRANT ALL ON TABLE "public"."specialties" TO "authenticated";
GRANT ALL ON TABLE "public"."specialties" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































