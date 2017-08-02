// see also https://github.com/okgrow/merge-graphql-schemas

// DateTime: see https://github.com/graphql/graphql-js/issues/497

exports.types = `

  # A date/time.
  scalar DateTime

  ##### Query
  
  # You can query on these types.
  type Query {
    # Get DataSphere Overview.
      dataSphere: DataSphere,
    # Get VirtualDataSphere Overview.
      virtualDataSphere(uoid:String): [VirtualDataSphere],
    # Get user by 'id' -- or all users if no id is given.
      users(id:Int): [User],
    # Get files by 'type' = {ALL|DIRECTORY|FILE}.
      files(type:FileType): [File],
    # Get filesStats by 'inode'.
      filesStats(inode:Int): [FileStats],
    # Get all events.
      events: [Events],
    # Get all tasks.
      tasks: [Tasks],
    # Get activity metrics.
      activity: [Activity],
    # Get alignment metrics.
      alignment: Alignment,
    # Get performance metrics.
      performance: Performance,
    # Get capacity metrics.
      capacity: Capacity
    # Get storage configuration.
      storage: [StorageResources],
    # Get share by uoid.
      share(uoid:String): [StorageResource]
    # Get storageResources by resourceType.
      resourcesOfType(resourceType:ResourceType): [StorageResource]
  }


  ##### A DataSphere and VirtualDataSphere.
  
  type DataSphere implements ResourceInterface {
    uoid: String!
    id: ResourceId!
    admins: [UserAuth],
    virtualDataSpheres: [VirtualDataSphere]
  }

  type VirtualDataSphere {
    id: ResourceId,
    location: String,
    admins: [UserAuth],
    health: Health,
    computeResources: [ComputeResources],
    storageResources: [StorageResources],
    communicationResources: [CommunicationResources],
    activeUsers: [UserAuth]
  }


  ##### Resource Generics.

  # ResourceInterface: Common to every Resource.
  interface ResourceInterface {
    uoid: String!
    id: ResourceId!
  }
  
  # Resource identifier: a Type, human-usable name, optional human-usable description, internal unique object id "uoid" / key.
  type ResourceId {
    resourceType: ResourceType!,
    name: String!,
    description: String,
    uoid: String!
  }
   
  # Resource types.
  enum ResourceType {
    DATASPHERE
    VIRTUAL_DATASPHERE
    COLLECTION
    SHARE
    STORAGE_GROUP
    NODE
    VOLUME
    FILESYSTEM
    FILE
    USER
  }


  ##### Service support.
  
  # Map all uoid => resource.
  type ResourceIndex {
    uoid: String!,
    resource: ResourceInterface!
  }
  
  # Transient containment relation.
  type ContainmentMap {
    container: ResourceId!,
    contains: [ ResourceId ]!
  }
  
  
  ##### Concrete Resources.

  # All Resources in a DataSphere.
  type StorageResources implements ResourceInterface {
    id: ResourceId!,
    uoid: String!,
    shares: [StorageResource]!,
    collections: [StorageResource]!,
    storageGroups: [StorageResource]!,
    nodes: [StorageResource]!,
    volumes: [StorageResource]!,
    filesystems: [Filesystem]!
  }

  # A Physical or Logical Storage Resource (see storageType): Health, Capabilities, Activity.
  type StorageResource implements ResourceInterface {
    id: ResourceId!,
    uoid: String!,
    health: Health,
    capabilities: StorageCapabilities,
    mobility: DataMobility
  }
  
  # An entity is HEALTHY or has disorders.
  type Health {
    status: HealthStatus,
    disorders: [UserMessage]
  }
  
  # Healthy - or maximum severity of disorder.
  enum HealthStatus {
    HEALTHY
    WARNING
    FAILED
  }

  # messageTemplate is a i18n translatable symbol; translation may embed dynamically from 'data[]'. 
  type UserMessage {
    severity: HealthStatus,
    messageTemplate: String,
    data: [String]!
  }


  ##### Capabilities
  
  # StorageCapabilities: collects capacity, bandwidth, operation, and latency properties.
  type StorageCapabilities {
    capacities: Capacities,
    bandwidths: Bandwidths,
    operations: Operations,
    latencies:  Latencies
  }

  # Filesystem: objectUoid is host volume.  CompliantFiles = usedInodes - (nonCompliantFiles+severelyNonCompliantFiles).
  type Filesystem {
    objectUoid: String!,
    totalInodes: Int,
    availableInodes: Int,
    usedInodes: Int,
    otherInodes: Int,
    nonCompliantFiles: [File]!,
    severelyNonCompliantFiles: [File]!
  }

  # Capacities in MegaBytes: current, thresholds, measurements.
  type Capacities implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    totalMB: Int,
    availableMB: Int,
    usedMB: Int,
    otherMB: Int,
    thresholds: [Threshold],
    measurements: [Measurement]
  }

  # Bandwidths in MegaBytesPerSecond: current, thresholds, measurements.
  type Bandwidths implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    readMBPerSecond: Int,
    writeMBPerSecond: Int,
    readMBPerSecondCapability: Int,
    writeMBPerSecondCapability: Int,
    thresholds: [Threshold],
    measurements: [Measurement]
  }  

  # Operations: current, thresholds, measurements.
  type Operations implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    readPerSecond: Int,
    writePerSecond: Int,
    metaDataReadPerSecond: Int,
    metaDataWritePerSecond: Int,
    readPerSecondCapability: Int,
    writePerSecondCapability: Int,
    metaDataReadPerSecondCapability: Int,
    metaDataWritePerSecondCapability: Int,
    thresholds: [Threshold],
    measurements: [Measurement]
  }  

  # Latencies in milliseconds: current, thresholds, measurements.
  type Latencies implements MeasurementsInterface, ThresholdInterface {
    objectUoid: String!,
    readMs: Int,
    writeMs: Int,
    readMsCapability: Int,
    writeMsCapability: Int,
    thresholds: [Threshold]!,
    measurements: [Measurement]
  }  


  # Mobility measures and [in]active children.
  type DataMobility {
    mobilityMeasures: [MobilityMeasure],
    mostActiveChildUoids: [String]!,
    leastActiveChildUoids: [String]!
  }
  
  # Data moved to or from a partner.
  type MobilityMeasure implements MeasurementsInterface {
    objectUoid: String!,
    direction: Direction!,
    partnerUoid: String!,
    measurements: [Measurement]
  }
  
  # The direction of data flow.  Useful in a context with uoid and partnerUoid; relative to uioid.
  enum Direction {
    TO
    FROM
  }


  ##### Measurements
  
  # MeasurementsInterface: Common to Measurement.
  interface MeasurementsInterface {
    objectUoid: String!,
    measurements: [Measurement]
  }
  
  # Something measured and its measurements.
  type Measurement {
    metric: Metric,
    values: [Float]!
  }
  
  # Something measurable, the timeSpan and sample count, the reduction function.
  type Metric {
    metricType: MetricType,
    metricUnit: MetricUnit,
    metricFunction: MetricFunction,
    timeSpan: TimeSpan!
  }
  
  # A measurable property. Multiple measurements may be reported by type: e.g. OPERATIONS may include read and write for METADATA and regular IO.
  enum MetricType {
    CAPACITIES
    BANDWIDTHS
    OPERATIONS
    LATENCIES
    TRANSFER
  }
  
  # Metric units.
  enum MetricUnit {
    MB
    PERCENT
    MBPS
    MS
    OPS
  }

  # A reduction function X(array) => singleValue.
  enum MetricFunction {
    RAW
    AVERAGE
    MAXIMUM
  }


  ##### Thresholds.
  
  # ThresholdInterface: Common to Threshold.
  # Object objectUoid has these thresholds.
  interface ThresholdInterface {
    objectUoid: String!,
    thresholds: [Threshold]
  }

  # Threshold.  A MetricUnit has a warningLimit and a severeLimit.
  # Over timeSpan, the ThresholdInterface objectUoid (NOT SELF-IDENTIFYING?) has exceeded the limits Count times.
  type Threshold {
    unit: MetricUnit,
    timeSpan: TimeSpan,
    warningLimit: Int,
    warningCount: Int,
    severeLimit: Int,
    severeCount: Int
  }


  ##### Time.
  
  # TimeSpan.  Unit is Unix Epoch Time: milliseconds since 12am Jan 1st 1970.
  # Use case: A Metric may have an associated time span.  
  # The span may be specified as:
  # - an absolute range: startMs - endMs                 // durationMs is -1
  # - an absolute range: startMs - durationMs            // endMs is -1
  # - an absolute range: startMs - (startMs+durationMs)  // endMs is -1 
  # - an absolute range: startMs - (endMs-durationMs)    // startMs is -1 
  # - a relative range:  (now-durationMs) - now          // startMs and endMs are -1
  type TimeSpan {
    startMs: Int,
    endMs: Int,
    durationMs: Int
  }
  
  
  ##### SM Activity 
  
  # Activity on a storage resource.
  type Activity {
    storageResource: StorageResources,
    timestamp: String,
    maxReadOps: Float,
    maxWriteOps: Float
  }

  # Common structure across Alignment, Performance, and Capacity records.
  interface SmActivityData {
    query: SmActivityQuery,
    max: Float,
    breakdown: [SmActivityBreakdown]
  }

  # Query - what is a good name for this class??
  type SmActivityQuery {
    storageContainer: String,
    breakdown: BreakdownType
  }

  # BreakdownType
  enum BreakdownType {
    NONE
  }
  
  # Alignment of physical or logical storage.
  type Alignment implements SmActivityData {
    query: SmActivityQuery,
    max: Float,
    breakdown: [SmActivityBreakdown]
  }

  # Performance of physical or logical storage.
  type Performance implements SmActivityData {
    query: SmActivityQuery,
    max: Float,
    breakdown: [SmActivityBreakdown]
  }

  # Capacity of physical or logical storage. AKA 'Space'.
  type Capacity implements SmActivityData {
    query: SmActivityQuery,
    max: Float,
    breakdown: [SmActivityBreakdown]
  }

  # Breakdown.  TBD.
  type SmActivityBreakdown {
    share: String,
    storageContainer: String,
    data: String
  }
  
  
  ##### Users.
  
  # A user.
  type User {
    id: Int!,
    date: DateTime,
    name: String,
    files: [File],
    filesStats: [FileStats]
  }

  type UserAuth {
    userId: ResourceId,
    roles: [String]
  }


  ##### SM Files.
  
  # File type.
  enum FileType {
    ALL
    DIRECTORY
    FILE
  }
  
  # A file.
  type File {
    executable: Boolean,
    explicit: Boolean,
    lastModified: String,
    logicalSize: String,
    name: String,
    parent: String,
    path: String,
    permanentDataLoss: Boolean,
    physicalSize: String,
    profileName: String,
    readable:Boolean,
    shareName: String,
    sharePath: String,
    size: String,
    sloTargets: String,
    slos: String,
    type: String,
    volumes: String,
    writable:Boolean,
    children: [File]
  }

  # A set of statistics for a file.  Columns defines units and order, rows contain values.
  type FileStats {
    name: String,
    tags: String,
    columns: [String],
    rows: [PdfsStats]
  }

  type PdfsStats {
    inode: Int,
    clientId: Int,
    instanceId: Int,
    avgIops: Int,
    objectId: Int,
    time: String,
    timeStamp: String
  }
  
  
  ##### Other.

  # An event with a type, severity, parameters, etc.
  type Events {
    severity: String,
    type: String,
    params: [String]
    created: String,
    cleared: Boolean,
    clearTime: String
  }

  # An asynchronous task with a name, status, progress, etc.
  type Tasks {
    name: String,
    paramsMap: String,
    paramsMapJson: String,
    created: String,
    started: String,
    status: String,
    progress: Int,
    exitValue: String
  }

  # ComputeResources.  TBD
  type ComputeResources {
    cpu: String
  }

  # CommunicationResources.  TBD
  type CommunicationResources {
    networkInterfaces: [NetworkInterface]
  }

  # NetworkInterface.  TBD
  type NetworkInterface {
    id: ResourceId,
    nodeId: ResourceId,
    bandwidths: Bandwidths,
    operations: Operations,
    latencies:  Latencies
  }

`;

// NOTES:

// # native server timespan is always MILLISECONDS
// enum UiTimeSpan {
//     MILLISECOND
//     SECOND
//     MINUTE
//     HOUR
//     DAY
//     WEEK
//     MONTH
//     YEAR
//     FOREVER
// }

