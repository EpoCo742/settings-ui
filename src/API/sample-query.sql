SELECT
  s.settings_id,
  s.group_id,
  s.group_name,
  s.created_by,
  s.updated_by,
  s.date_created,
  s.date_updated,
  s.threshold,
  s.is_deleted,
  s.deleted_by,
  s.deleted_at,
  -- Aggregate associated arrays
  (
    SELECT LISTAGG(t.value, ',') WITHIN GROUP (ORDER BY t.value)
    FROM transaction_types t
    WHERE t.settings_id = s.settings_id
  ) AS transaction_types,
  (
    SELECT LISTAGG(f.value, ',') WITHIN GROUP (ORDER BY f.value)
    FROM frequency f
    WHERE f.settings_id = s.settings_id
  ) AS frequency,
  (
    SELECT LISTAGG(i.value, ',') WITHIN GROUP (ORDER BY i.value)
    FROM indicator i
    WHERE i.settings_id = s.settings_id
  ) AS indicator,
  (
    SELECT LISTAGG(a.value, ',') WITHIN GROUP (ORDER BY a.value)
    FROM authorization a
    WHERE a.settings_id = s.settings_id
  ) AS authorization
FROM settings s
WHERE s.settings_id = :settingId;
