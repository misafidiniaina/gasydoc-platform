SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict TomeqYBt6Mm9ZmnWdZs3OYKrphaaMK7UrdxXAhZeIny6upneQRPXi1eXfvTeR23

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e577f56a-da28-4f04-a2e7-22024a0da702', 'authenticated', 'authenticated', 'mpitsabo@gmail.com', '$2a$10$DTSPg43gCOIKGm1Mb6dgUe1o9NUPNtIB.Joq5koeZR.hvRhcsYwBW', '2026-06-23 04:34:34.693363+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-28 04:38:17.796569+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "e577f56a-da28-4f04-a2e7-22024a0da702", "role": "professional", "email": "mpitsabo@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-23 04:34:34.659538+00', '2026-06-28 04:38:17.813674+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', 'authenticated', 'authenticated', 'cabinetmed@gmail.com', '$2a$10$WP90OMsTp92F8ycnJdoMue74hWWGiYO25125a/.oFg97bhKF.yZP2', '2026-06-23 12:51:22.879669+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-23 12:51:22.885296+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8a299d3f-6b00-4ecd-9199-185aa4f714f8", "role": "clinic", "email": "cabinetmed@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-23 12:51:22.860665+00', '2026-06-24 11:38:19.790602+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd3089ed7-da67-428d-b772-66f28ea90525', 'authenticated', 'authenticated', 'cabinet@gmail.com', '$2a$10$ikLvUCdTm6BQ6hk6mJ9kKevghO4tp/1C/Ken3v0moPJayy6aTrcfa', '2026-06-23 05:49:07.316833+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-23 06:13:09.722655+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d3089ed7-da67-428d-b772-66f28ea90525", "role": "clinic", "email": "cabinet@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-23 05:49:07.281109+00', '2026-06-23 08:24:56.560323+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a02a0341-c023-46e3-8cf7-0d24b4507bfc', 'authenticated', 'authenticated', 'misafidiniaina@gmail.com', '$2a$10$8sNOQsMb8QU5vgjTqcgJfev71i1YBrYCSC4QhWqx1sqrzs.XjMafS', '2026-06-16 14:33:07.315417+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-23 04:18:24.909823+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a02a0341-c023-46e3-8cf7-0d24b4507bfc", "role": "clinic", "email": "misafidiniaina@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-16 14:33:07.278918+00', '2026-06-23 04:18:24.923709+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5f5d7105-524e-480f-b87d-74326a85e780', 'authenticated', 'authenticated', 'liantsoatsiorinirina@gmail.com', '$2a$10$mMup1UAqRf/FmiPamFrZEeWkZ4ekEymyGazDQpioaRyCvM5xLVee6', '2026-06-16 14:44:08.282607+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-23 04:31:15.947741+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "5f5d7105-524e-480f-b87d-74326a85e780", "role": "professional", "email": "liantsoatsiorinirina@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-16 14:44:08.260689+00', '2026-06-23 04:31:15.978063+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9725ca92-45e8-46f5-8776-88ba5b94e17c', 'authenticated', 'authenticated', 'pictlay@gmail.com', '$2a$10$D7pcohblW49/uWRGvJKAZO/n48kh/iZEszTiF2ISSwuGgsAf/j2Zu', '2026-06-23 10:58:27.049154+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-23 10:58:27.056692+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "9725ca92-45e8-46f5-8776-88ba5b94e17c", "role": "professional", "email": "pictlay@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-23 10:58:27.010541+00', '2026-06-23 11:56:55.499837+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a02a0341-c023-46e3-8cf7-0d24b4507bfc', 'a02a0341-c023-46e3-8cf7-0d24b4507bfc', '{"sub": "a02a0341-c023-46e3-8cf7-0d24b4507bfc", "role": "clinic", "email": "misafidiniaina@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-16 14:33:07.310839+00', '2026-06-16 14:33:07.310902+00', '2026-06-16 14:33:07.310902+00', '168272bd-6023-488c-9c8c-904c2537baf3'),
	('5f5d7105-524e-480f-b87d-74326a85e780', '5f5d7105-524e-480f-b87d-74326a85e780', '{"sub": "5f5d7105-524e-480f-b87d-74326a85e780", "role": "professional", "email": "liantsoatsiorinirina@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-16 14:44:08.2793+00', '2026-06-16 14:44:08.279366+00', '2026-06-16 14:44:08.279366+00', 'd4da3500-acf7-4790-b9ba-1a2b8f499921'),
	('e577f56a-da28-4f04-a2e7-22024a0da702', 'e577f56a-da28-4f04-a2e7-22024a0da702', '{"sub": "e577f56a-da28-4f04-a2e7-22024a0da702", "role": "professional", "email": "mpitsabo@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-23 04:34:34.687019+00', '2026-06-23 04:34:34.687627+00', '2026-06-23 04:34:34.687627+00', '630d56de-7fc0-4649-808d-0f132b872599'),
	('d3089ed7-da67-428d-b772-66f28ea90525', 'd3089ed7-da67-428d-b772-66f28ea90525', '{"sub": "d3089ed7-da67-428d-b772-66f28ea90525", "role": "clinic", "email": "cabinet@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-23 05:49:07.313006+00', '2026-06-23 05:49:07.313689+00', '2026-06-23 05:49:07.313689+00', '752acafd-174a-4aaa-a042-8d9c48e32ee3'),
	('9725ca92-45e8-46f5-8776-88ba5b94e17c', '9725ca92-45e8-46f5-8776-88ba5b94e17c', '{"sub": "9725ca92-45e8-46f5-8776-88ba5b94e17c", "role": "professional", "email": "pictlay@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-23 10:58:27.040539+00', '2026-06-23 10:58:27.041148+00', '2026-06-23 10:58:27.041148+00', '1aff2fa8-dc5c-4534-9239-ce189071369e'),
	('8a299d3f-6b00-4ecd-9199-185aa4f714f8', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', '{"sub": "8a299d3f-6b00-4ecd-9199-185aa4f714f8", "role": "clinic", "email": "cabinetmed@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-23 12:51:22.874898+00', '2026-06-23 12:51:22.875561+00', '2026-06-23 12:51:22.875561+00', '1bd75d85-1d74-414a-bbf1-ba2d32021f66');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('c2eac1ba-fb61-4a40-80b6-7d60f454b6df', '9725ca92-45e8-46f5-8776-88ba5b94e17c', '2026-06-23 10:58:27.057861+00', '2026-06-23 11:56:55.512096+00', NULL, 'aal1', NULL, '2026-06-23 11:56:55.510441', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', '151.240.254.13', NULL, NULL, NULL, NULL, NULL),
	('a930fee1-0762-4b9f-a430-661e3d5e0603', 'e577f56a-da28-4f04-a2e7-22024a0da702', '2026-06-23 10:47:23.775299+00', '2026-06-23 15:50:53.103135+00', NULL, 'aal1', NULL, '2026-06-23 15:50:53.103028', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 OPR/129.0.0.0', '102.18.63.228', NULL, NULL, NULL, NULL, NULL),
	('e402b2c4-a43e-49b3-bda2-8230236e2f70', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', '2026-06-23 12:51:22.886403+00', '2026-06-24 11:38:19.803715+00', NULL, 'aal1', NULL, '2026-06-24 11:38:19.803598', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', '185.156.46.113', NULL, NULL, NULL, NULL, NULL),
	('67852464-e916-434e-b3e4-320932e39d10', 'e577f56a-da28-4f04-a2e7-22024a0da702', '2026-06-23 15:51:02.599858+00', '2026-06-28 04:36:34.561321+00', NULL, 'aal1', NULL, '2026-06-28 04:36:34.559717', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 OPR/129.0.0.0', '102.18.60.121', NULL, NULL, NULL, NULL, NULL),
	('915f53fe-6aab-4d1b-a988-27f0a293cddc', 'e577f56a-da28-4f04-a2e7-22024a0da702', '2026-06-28 04:38:17.796665+00', '2026-06-28 04:38:17.796665+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 OPR/129.0.0.0', '102.18.60.121', NULL, NULL, NULL, NULL, NULL),
	('456a48d5-38f4-4a4c-94f6-443befdc5ca3', 'd3089ed7-da67-428d-b772-66f28ea90525', '2026-06-23 06:13:09.723828+00', '2026-06-23 08:24:56.569707+00', NULL, 'aal1', NULL, '2026-06-23 08:24:56.569592', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 OPR/129.0.0.0', '102.18.63.228', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('456a48d5-38f4-4a4c-94f6-443befdc5ca3', '2026-06-23 06:13:09.743284+00', '2026-06-23 06:13:09.743284+00', 'password', '059b3089-df5e-426a-ad6f-2967cd259bd3'),
	('a930fee1-0762-4b9f-a430-661e3d5e0603', '2026-06-23 10:47:23.828678+00', '2026-06-23 10:47:23.828678+00', 'password', '143c3221-f603-450f-9f81-ed3f8cb337fc'),
	('c2eac1ba-fb61-4a40-80b6-7d60f454b6df', '2026-06-23 10:58:27.067146+00', '2026-06-23 10:58:27.067146+00', 'password', '3429f467-5aea-475b-8c00-bd282bff5a6f'),
	('e402b2c4-a43e-49b3-bda2-8230236e2f70', '2026-06-23 12:51:22.89833+00', '2026-06-23 12:51:22.89833+00', 'password', 'c5171718-9ebd-4ebe-82c2-a23b39b9bbb5'),
	('67852464-e916-434e-b3e4-320932e39d10', '2026-06-23 15:51:02.622831+00', '2026-06-23 15:51:02.622831+00', 'password', '6f9edb18-4923-4a1b-9ef9-00f9d5e5262d'),
	('915f53fe-6aab-4d1b-a988-27f0a293cddc', '2026-06-28 04:38:17.821297+00', '2026-06-28 04:38:17.821297+00', 'password', '605eaecf-8eac-4376-9b1a-bc1a8d9978e8');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 53, 'fihlr5nmkrau', 'd3089ed7-da67-428d-b772-66f28ea90525', true, '2026-06-23 06:13:09.737582+00', '2026-06-23 07:26:16.816096+00', NULL, '456a48d5-38f4-4a4c-94f6-443befdc5ca3'),
	('00000000-0000-0000-0000-000000000000', 54, 't62wzlmmz2iy', 'd3089ed7-da67-428d-b772-66f28ea90525', true, '2026-06-23 07:26:16.834393+00', '2026-06-23 08:24:56.545729+00', 'fihlr5nmkrau', '456a48d5-38f4-4a4c-94f6-443befdc5ca3'),
	('00000000-0000-0000-0000-000000000000', 55, 'unw2blaig6gk', 'd3089ed7-da67-428d-b772-66f28ea90525', false, '2026-06-23 08:24:56.555974+00', '2026-06-23 08:24:56.555974+00', 't62wzlmmz2iy', '456a48d5-38f4-4a4c-94f6-443befdc5ca3'),
	('00000000-0000-0000-0000-000000000000', 57, 'clugwb6uoh5s', '9725ca92-45e8-46f5-8776-88ba5b94e17c', true, '2026-06-23 10:58:27.062542+00', '2026-06-23 11:56:55.478108+00', NULL, 'c2eac1ba-fb61-4a40-80b6-7d60f454b6df'),
	('00000000-0000-0000-0000-000000000000', 58, '6hsg5bm5oplq', '9725ca92-45e8-46f5-8776-88ba5b94e17c', false, '2026-06-23 11:56:55.490885+00', '2026-06-23 11:56:55.490885+00', 'clugwb6uoh5s', 'c2eac1ba-fb61-4a40-80b6-7d60f454b6df'),
	('00000000-0000-0000-0000-000000000000', 56, 'bmkzsgko6jao', 'e577f56a-da28-4f04-a2e7-22024a0da702', true, '2026-06-23 10:47:23.800609+00', '2026-06-23 14:45:07.831867+00', NULL, 'a930fee1-0762-4b9f-a430-661e3d5e0603'),
	('00000000-0000-0000-0000-000000000000', 60, 'df747lyey5ki', 'e577f56a-da28-4f04-a2e7-22024a0da702', true, '2026-06-23 14:45:07.841098+00', '2026-06-23 15:50:53.081261+00', 'bmkzsgko6jao', 'a930fee1-0762-4b9f-a430-661e3d5e0603'),
	('00000000-0000-0000-0000-000000000000', 61, '6kkxzphapmc7', 'e577f56a-da28-4f04-a2e7-22024a0da702', false, '2026-06-23 15:50:53.08879+00', '2026-06-23 15:50:53.08879+00', 'df747lyey5ki', 'a930fee1-0762-4b9f-a430-661e3d5e0603'),
	('00000000-0000-0000-0000-000000000000', 59, '4fil55so7y4j', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', true, '2026-06-23 12:51:22.892618+00', '2026-06-24 11:38:19.75392+00', NULL, 'e402b2c4-a43e-49b3-bda2-8230236e2f70'),
	('00000000-0000-0000-0000-000000000000', 63, 'xkpwscrcj3y6', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', false, '2026-06-24 11:38:19.778792+00', '2026-06-24 11:38:19.778792+00', '4fil55so7y4j', 'e402b2c4-a43e-49b3-bda2-8230236e2f70'),
	('00000000-0000-0000-0000-000000000000', 62, 'ycolg46gqjte', 'e577f56a-da28-4f04-a2e7-22024a0da702', true, '2026-06-23 15:51:02.612706+00', '2026-06-28 04:36:34.51486+00', NULL, '67852464-e916-434e-b3e4-320932e39d10'),
	('00000000-0000-0000-0000-000000000000', 64, 'wgmnybo3feez', 'e577f56a-da28-4f04-a2e7-22024a0da702', false, '2026-06-28 04:36:34.538844+00', '2026-06-28 04:36:34.538844+00', 'ycolg46gqjte', '67852464-e916-434e-b3e4-320932e39d10'),
	('00000000-0000-0000-0000-000000000000', 65, 'sdr7nkc5cx57', 'e577f56a-da28-4f04-a2e7-22024a0da702', false, '2026-06-28 04:38:17.81211+00', '2026-06-28 04:38:17.81211+00', NULL, '915f53fe-6aab-4d1b-a988-27f0a293cddc');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cities" ("id", "name") VALUES
	('28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'Antananarivo'),
	('b5ebfea9-dae7-44b5-a400-a2d72c13e948', 'Toamasina'),
	('02a888c7-689d-4219-81a8-8d105d8bd1c4', 'Antsirabe'),
	('bf24a91d-97c0-4593-a2cc-af464006df39', 'Fianarantsoa'),
	('457ce53c-6e23-4fda-94e6-79a7f11174e6', 'Mahajanga'),
	('9506f37b-aae4-46b6-b8bb-3fa85ad73345', 'Toliara'),
	('741f84fb-629a-4526-af19-d08b2ef8979e', 'Antsiranana');


--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."clinics" ("id", "owner_id", "name", "city_id", "logo_url", "description", "phone", "created_at") VALUES
	('90b98a51-808c-4b77-b840-ef578d9179e3', 'a02a0341-c023-46e3-8cf7-0d24b4507bfc', 'Clinique Sainte Marie', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'logos/a02a0341-c023-46e3-8cf7-0d24b4507bfc.jpeg', 'Clinique de référence à Antananarivo, spécialisée en médecine générale et chirurgie. Notre équipe de professionnels qualifiés vous accueille du lundi au samedi.', '034 00 000 01', '2026-06-16 14:33:07.898742'),
	('289f857f-5d12-465d-ab97-3b9dfb07f3bb', 'd3089ed7-da67-428d-b772-66f28ea90525', 'QC Med', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'logos/d3089ed7-da67-428d-b772-66f28ea90525.jpg', '', '', '2026-06-23 05:49:07.963151'),
	('e73e4d50-11a5-4578-88ee-209abb0cabc2', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', 'Cabinet medical Essai', '02a888c7-689d-4219-81a8-8d105d8bd1c4', 'logos/8a299d3f-6b00-4ecd-9199-185aa4f714f8.png', 'cabinet a tAna', '034 00 534 57', '2026-06-23 12:51:23.624652');


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."specialties" ("id", "name") VALUES
	('4984f8f6-7f0a-41e9-ab90-92f0c93223e9', 'Médecin généraliste'),
	('ec684ffc-fcca-4a98-9271-d0c194c3a74a', 'Spécialiste'),
	('e8ccd90e-a14f-4648-99f0-b6c88f5a514c', 'Infirmier(e)'),
	('20702d2d-4cef-4ef6-8608-e998a8dec76e', 'Sage-femme'),
	('619bb144-856b-4dd5-99cc-6f610fd1defb', 'Assistant médical'),
	('60f2094f-2954-4aa5-9d86-e8d530d72336', 'Technicien & Paramédical');


--
-- Data for Name: job_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."job_posts" ("id", "clinic_id", "title", "specialty_id", "city_id", "contract_type", "schedule", "experience_min_years", "description", "is_urgent", "is_active", "created_at") VALUES
	('630e440f-a0bb-4778-b77e-67c7dbfd33b6', NULL, 'Médecin généraliste', '4984f8f6-7f0a-41e9-ab90-92f0c93223e9', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'Temps plein', 'Jour', 2, 'Nous recherchons un médecin généraliste pour renforcer notre équipe. Poste en CDI, horaires de jour.', true, true, '2026-06-16 10:24:26.458983'),
	('b64676c2-d7a0-466c-8977-3e4a5bdd84dc', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Sage-femme', '20702d2d-4cef-4ef6-8608-e998a8dec76e', '02a888c7-689d-4219-81a8-8d105d8bd1c4', 'Week-end', 'Jour', 0, 'Nous cerchons une sage-femme', true, true, '2026-06-16 14:36:40.160578'),
	('fdbc0e04-d123-49db-b69b-6f0025925522', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Médecin généraliste', '4984f8f6-7f0a-41e9-ab90-92f0c93223e9', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'Temps plein', 'Jour', 2, 'Nous recherchons un médecin généraliste expérimenté pour rejoindre notre équipe dynamique. Le candidat idéal sera capable de gérer des consultations variées et de travailler en collaboration avec nos spécialistes.', true, true, '2026-06-23 04:29:35.739704'),
	('d5639df0-2bd8-42c1-a12d-2cddff47a24e', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Infirmier(e) diplômé(e)', 'e8ccd90e-a14f-4648-99f0-b6c88f5a514c', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'Temps partiel', 'Après-midi', 1, 'Cabinet médical recherche infirmier(e) diplômé(e) pour renforcer son équipe. Poste en temps partiel, horaires après-midi. Expérience minimum 1 an requise.', false, true, '2026-06-23 04:29:35.739704'),
	('b41443ac-7380-4d3e-ae7f-01e5d8f78c42', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Sage-femme', '20702d2d-4cef-4ef6-8608-e998a8dec76e', 'bf24a91d-97c0-4593-a2cc-af464006df39', 'Temps plein', 'Jour', 2, 'Nous recherchons une sage-femme pour notre service maternité. Le poste implique le suivi des grossesses, l''accouchement et les soins post-nataux. Environnement de travail moderne et bien équipé.', true, true, '2026-06-23 04:29:35.739704'),
	('a1c7451f-8457-4bfa-aceb-5562d2b60874', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Assistant médical', '619bb144-856b-4dd5-99cc-6f610fd1defb', 'b5ebfea9-dae7-44b5-a400-a2d72c13e948', 'Vacation', 'Jour', 0, 'Poste d''assistant médical en vacation pour soutenir nos équipes lors des pics d''activité. Aucune expérience requise, formation assurée en interne.', false, true, '2026-06-23 04:29:35.739704'),
	('9957e794-7df6-4bf3-9b72-64d6b214d429', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Médecin spécialiste cardiologue', 'ec684ffc-fcca-4a98-9271-d0c194c3a74a', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 'Temps plein', 'Jour', 5, 'Clinique Sainte Marie recrute un cardiologue confirmé. Vous intégrerez un plateau technique moderne avec échographie cardiaque, holter ECG et épreuve d''effort. Collaboration avec une équipe pluridisciplinaire.', false, true, '2026-06-23 04:29:35.739704'),
	('729f6ea4-52ad-4052-8d60-640ba62c0f3d', '90b98a51-808c-4b77-b840-ef578d9179e3', 'Technicien de laboratoire', '60f2094f-2954-4aa5-9d86-e8d530d72336', '457ce53c-6e23-4fda-94e6-79a7f11174e6', 'Temps plein', 'Jour', 2, 'Nous cherchons un technicien de laboratoire rigoureux pour notre service d''analyses médicales. Maîtrise des automates et bonne connaissance des normes biologiques requises.', false, true, '2026-06-23 04:29:35.739704');


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."applications" ("id", "job_id", "applicant_id", "message", "status", "created_at") VALUES
	('a6a07c2a-501d-4dae-90dc-36035c510808', 'b64676c2-d7a0-466c-8977-3e4a5bdd84dc', '5f5d7105-524e-480f-b87d-74326a85e780', 'je suis un sage femme', 'accepted', '2026-06-16 14:46:20.492949'),
	('49a357aa-44b7-4315-ba59-16603ce9fe2c', '630e440f-a0bb-4778-b77e-67c7dbfd33b6', '5f5d7105-524e-480f-b87d-74326a85e780', 'Je suis très intéressée par ce poste et je pense que mon expérience correspond parfaitement à vos attentes.', 'pending', '2026-06-23 04:29:35.739704'),
	('449c1ec0-6f7e-482f-8e14-e305bba1996f', 'a1c7451f-8457-4bfa-aceb-5562d2b60874', '5f5d7105-524e-480f-b87d-74326a85e780', NULL, 'viewed', '2026-06-23 04:29:35.739704'),
	('e6a56ce8-eb91-455f-8f61-19c074d7f38c', '729f6ea4-52ad-4052-8d60-640ba62c0f3d', '5f5d7105-524e-480f-b87d-74326a85e780', 'Je souhaite élargir mes compétences dans un nouvel environnement.', 'rejected', '2026-06-23 04:29:35.739704');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "phone", "bio", "specialty_id", "city_id", "experience_years", "avatar_url", "cv_url", "is_available", "created_at", "views") VALUES
	('9725ca92-45e8-46f5-8776-88ba5b94e17c', 'Pict', '0340529003', '', 'ec684ffc-fcca-4a98-9271-d0c194c3a74a', '28faabb3-f1e8-4932-b55b-a3cd03a62b34', 10, 'avatars/9725ca92-45e8-46f5-8776-88ba5b94e17c.jpg', NULL, false, '2026-06-23 10:58:27.773794', 0),
	('5f5d7105-524e-480f-b87d-74326a85e780', 'Miora Rakoto', '034 12 345 67', 'Médecin généraliste diplômée de l''Université d''Antananarivo avec 4 ans d''expérience. Passionnée par la médecine préventive et le suivi des patients chroniques.', '20702d2d-4cef-4ef6-8608-e998a8dec76e', 'b5ebfea9-dae7-44b5-a400-a2d72c13e948', 4, 'avatars/5f5d7105-524e-480f-b87d-74326a85e780.jpeg', 'cvs/5f5d7105-524e-480f-b87d-74326a85e780.pdf', true, '2026-06-16 14:44:09.004473', 0),
	('e577f56a-da28-4f04-a2e7-22024a0da702', 'Liana Mandavo', '', '', NULL, '28faabb3-f1e8-4932-b55b-a3cd03a62b34', NULL, 'avatars/e577f56a-da28-4f04-a2e7-22024a0da702.jpg', NULL, true, '2026-06-23 04:34:35.349636', 0);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('profiles', 'profiles', NULL, '2026-06-16 08:09:40.779085+00', '2026-06-16 08:09:40.779085+00', false, false, NULL, NULL, NULL, 'STANDARD'),
	('clinics', 'clinics', NULL, '2026-06-17 08:06:29.162443+00', '2026-06-17 08:06:29.162443+00', false, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('b6520d29-6edc-40e1-8740-abae7b4ec982', 'profiles', 'cvs/5f5d7105-524e-480f-b87d-74326a85e780.pdf', '5f5d7105-524e-480f-b87d-74326a85e780', '2026-06-17 07:21:27.239453+00', '2026-06-17 07:21:27.239453+00', '2026-06-17 07:21:27.239453+00', '{"eTag": "\"2fefeaa6224041e886774159563bb686\"", "size": 3743, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-06-17T07:21:28.000Z", "contentLength": 3743, "httpStatusCode": 200}', '3e7c0e72-5c83-4033-8d8b-732042007055', '5f5d7105-524e-480f-b87d-74326a85e780', '{}'),
	('9f590367-674d-4e73-85d2-be72e3888a00', 'clinics', 'logos/a02a0341-c023-46e3-8cf7-0d24b4507bfc.jpeg', 'a02a0341-c023-46e3-8cf7-0d24b4507bfc', '2026-06-17 08:09:29.124215+00', '2026-06-17 08:09:29.124215+00', '2026-06-17 08:09:29.124215+00', '{"eTag": "\"20eacd7eee19fa14c509f5683bd2f2d3\"", "size": 6002, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-17T08:09:30.000Z", "contentLength": 6002, "httpStatusCode": 200}', '73ab24cb-eec3-4eeb-88af-0ff27f8a4df4', 'a02a0341-c023-46e3-8cf7-0d24b4507bfc', '{}'),
	('c8b27a05-5ff2-4645-b611-39b085fbc240', 'profiles', 'cvs/.emptyFolderPlaceholder', NULL, '2026-06-17 07:20:03.078865+00', '2026-06-17 07:20:03.078865+00', '2026-06-17 07:20:03.078865+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-06-17T07:20:03.077Z", "contentLength": 0, "httpStatusCode": 200}', 'a4a86f8d-ebb5-4cbe-bd67-ca3cf5a894b8', NULL, '{}'),
	('e98587b1-4af0-428f-aaa3-e769124fe507', 'profiles', 'avatars/.emptyFolderPlaceholder', NULL, '2026-06-17 07:20:18.254632+00', '2026-06-17 07:20:18.254632+00', '2026-06-17 07:20:18.254632+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-06-17T07:20:18.253Z", "contentLength": 0, "httpStatusCode": 200}', '695fc939-bf09-4bec-aacf-03c6e3485b54', NULL, '{}'),
	('88bb7935-e020-46a6-afb6-db937c00e2bc', 'profiles', 'avatars/5f5d7105-524e-480f-b87d-74326a85e780.jpeg', '5f5d7105-524e-480f-b87d-74326a85e780', '2026-06-17 07:21:26.745361+00', '2026-06-17 07:21:26.745361+00', '2026-06-17 07:21:26.745361+00', '{"eTag": "\"7276fae61c7f614f26c03e5dd1d7dec9\"", "size": 7646, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-17T07:21:27.000Z", "contentLength": 7646, "httpStatusCode": 200}', '8952ed11-f214-40f0-a050-951429f03327', '5f5d7105-524e-480f-b87d-74326a85e780', '{}'),
	('ee88d134-ee15-48eb-b5c3-87835800afdb', 'clinics', 'logos/d3089ed7-da67-428d-b772-66f28ea90525.jpg', 'd3089ed7-da67-428d-b772-66f28ea90525', '2026-06-23 05:50:23.96139+00', '2026-06-23 05:51:54.363745+00', '2026-06-23 05:50:23.96139+00', '{"eTag": "\"fe1fcc164f724f4868420af5b7c9ca19\"", "size": 453170, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-23T05:51:55.000Z", "contentLength": 453170, "httpStatusCode": 200}', 'd84c6e36-2b6a-4770-8cda-0160cf980170', 'd3089ed7-da67-428d-b772-66f28ea90525', '{}'),
	('7b783697-dda0-4d0b-8856-13c6e87ca930', 'profiles', 'avatars/9725ca92-45e8-46f5-8776-88ba5b94e17c.jpg', '9725ca92-45e8-46f5-8776-88ba5b94e17c', '2026-06-23 11:18:11.754457+00', '2026-06-23 11:18:11.754457+00', '2026-06-23 11:18:11.754457+00', '{"eTag": "\"4c7ac73f39ec1b7345f1df29aa56f12b\"", "size": 103172, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-23T11:18:12.000Z", "contentLength": 103172, "httpStatusCode": 200}', '6679c61d-aafd-4ac5-bb84-770671d91b2a', '9725ca92-45e8-46f5-8776-88ba5b94e17c', '{}'),
	('fce59a0c-a34a-4a01-88bf-3d13d8626400', 'profiles', 'avatars/e577f56a-da28-4f04-a2e7-22024a0da702.jpg', 'e577f56a-da28-4f04-a2e7-22024a0da702', '2026-06-23 04:37:01.231243+00', '2026-06-23 05:47:39.745342+00', '2026-06-23 04:37:01.231243+00', '{"eTag": "\"871323e1794c402aa1530b2116ccb51e\"", "size": 3196402, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-06-23T05:47:40.000Z", "contentLength": 3196402, "httpStatusCode": 200}', 'e6558517-891a-4685-b887-ee86d9e959b7', 'e577f56a-da28-4f04-a2e7-22024a0da702', '{}'),
	('1bed10b6-6a42-459d-bf15-a99a78dabba2', 'clinics', 'logos/8a299d3f-6b00-4ecd-9199-185aa4f714f8.png', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', '2026-06-23 12:53:37.397979+00', '2026-06-23 12:53:37.397979+00', '2026-06-23 12:53:37.397979+00', '{"eTag": "\"e23622ad695ea217bbbca676d7d25043\"", "size": 158013, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-23T12:53:38.000Z", "contentLength": 158013, "httpStatusCode": 200}', '5eceacba-4734-4f07-9efc-173713834f41', '8a299d3f-6b00-4ecd-9199-185aa4f714f8', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 65, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict TomeqYBt6Mm9ZmnWdZs3OYKrphaaMK7UrdxXAhZeIny6upneQRPXi1eXfvTeR23

RESET ALL;
