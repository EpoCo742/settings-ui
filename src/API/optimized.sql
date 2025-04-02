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
  LISTAGG(t.value, ',') WITHIN GROUP (ORDER BY t.value) AS transaction_types,
  LISTAGG(f.value, ',') WITHIN GROUP (ORDER BY f.value) AS frequency,
  LISTAGG(i.value, ',') WITHIN GROUP (ORDER BY i.value) AS indicator,
  LISTAGG(a.value, ',') WITHIN GROUP (ORDER BY a.value) AS authorization
FROM settings s
LEFT JOIN transaction_types t ON t.settings_id = s.settings_id
LEFT JOIN frequency f ON f.settings_id = s.settings_id
LEFT JOIN indicator i ON i.settings_id = s.settings_id
LEFT JOIN authorization a ON a.settings_id = s.settings_id
WHERE s.settings_id = :settingId
GROUP BY
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
  s.deleted_at;